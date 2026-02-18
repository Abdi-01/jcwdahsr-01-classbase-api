import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import transport from "../config/nodemailer";
import { regisTemplate } from "../templates/regis.template";
import client from "../config/redis";
import { cloudinaryUpload } from "../config/cloudinary";

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const check = await prisma.account.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (check) {
        // return res.status(400).send({ success: false, message: "Email exist" });
        throw { rc: 400, success: false, message: "Email exist" };
      }

      const newAccount = await prisma.account.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      // send email

      await transport.sendMail({
        from: process.env.MAIL_SENDER,
        to: newAccount.email,
        subject: "Registration info",
        html: regisTemplate(newAccount.name),
      });

      res.status(200).send({
        success: true,
        message: "Register success",
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 2. filter to prisma.account
      const account = await prisma.account.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!account) {
        throw { rc: 404, success: false, message: "Account not found" };
      }

      // 3. compare password
      const checkPassword = await compare(
        req.body.password,
        account?.password as string,
      );
      if (!checkPassword) {
        throw { rc: 401, success: false, message: "Wrong password" };
      }

      // create token
      const token = createToken({ id: account.id });

      res.status(200).send({
        name: account.name,
        email: account.email,
        gender: account.gender,
        age: account.age,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  public keepLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = res.locals.decript;

      const account = await prisma.account.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!account) {
        throw { rc: 401, success: false, message: "Unautorized token" };
      }
      // create token
      const token = createToken({ id: account.id });

      res.status(200).send({
        name: account.name,
        email: account.email,
        gender: account.gender,
        age: account.age,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadImgProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.file) {
        throw { rc: 400, message: "File is no exist" };
      }
      const upload = await cloudinaryUpload(req.file);
      console.log(upload);

      await prisma.account.update({
        where: { id: Number(res.locals.decript.id) },
        data: {
          imgUrl: upload.secure_url,
        },
      });

      res.status(200).send("Upload image success");
    } catch (error) {
      next(error);
    }
  };

  public getAllAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // 1. check data in redis is exist ?
      const cacheData = await client.get("all");
      // 2. If data exist, send data from redis as response
      if (cacheData) {
        console.log("Data from redis");
        return res.status(200).send(JSON.parse(cacheData));
      }
      // 3. If not exist in redis, get data from db
      const data = await prisma.account.findMany();

      // 4. Store data to redis with key
      await client.setEx("all", 60, JSON.stringify(data));

      // 5. send response
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

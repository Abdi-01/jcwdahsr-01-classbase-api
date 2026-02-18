import { Request } from "express";
import multer from "multer";
import path from "path";

export const uploaderMemory = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 },
  });
};

export const uploader = (filePrefix: string, folderDir: string) => {
  const defaultDir = path.join(__dirname, "../public");

  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      const location = folderDir
        ? path.join(defaultDir, folderDir)
        : defaultDir;

      cb(null, location);
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const prefix = filePrefix || "file";
      console.log(file.originalname.split("."));
      const ext =
        file.originalname.split(".")[file.originalname.split(".").length - 1];

      const newName = `${prefix}_${Date.now()}.${ext}`;

      cb(null, newName);
    },
  });

  return multer({ storage });
};

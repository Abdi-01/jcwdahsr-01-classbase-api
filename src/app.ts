import dotenv from "dotenv";
dotenv.config();
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

const PORT = process.env.PORT;

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configure();
        this.routers();
        this.errorHandler();
    }

    // Private methode for configure middleware
    private configure = () => {
        this.app.use(cors());
        this.app.use(express.json());
    }

    // Private methode for route config
    private routers = () => {
        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).send("<h1>Classbase API</h1>")
        })

        // define route
    }

    // Private methode for errorhandling
    private errorHandler = () => {
        this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            console.log(error);
            res.status(500).send(error);
        })
    }

    // Public methode for start API

}

export default App;
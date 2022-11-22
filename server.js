import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import V1registerRouter from "./src/routes/v1/register.router.js";
import V1loginRouter from "./src/routes/v1/login.router.js";
import { instanciateDB } from "./src/services/database/database.service.js";

const port = process.env.PORT;

app.use(express.json());

app.use('/api/v1/register', V1registerRouter);
app.use('/api/v1/login', V1loginRouter);

export const start = async() => {
        try {
            const pool = await instanciateDB();
            app.listen(port, () => {
                console.log(`Application à l'écoute sur le port ${port}!`);
            });

        } catch (e) {
            console.error(e)
        }
    }
    /*
app.use(logError)
app.use(returnError)*/
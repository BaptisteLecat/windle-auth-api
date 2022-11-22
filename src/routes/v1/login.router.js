import { Router } from "express";
import { login } from "../../controllers/login.controllers.js";
import { check } from "express-validator";

const V1loginRouter = Router();

V1loginRouter.post("/",
    check("Authorization").exists().withMessage("Tokens is required"),
    check("deviceKey").exists().withMessage("deviceKey is required"), login);

export default V1loginRouter;
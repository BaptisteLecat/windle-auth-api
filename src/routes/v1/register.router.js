import { Router } from "express";
import { register, registerAnonymously } from "../../controllers/register.controllers.js";
import { check } from "express-validator";

const V1registerRouter = Router();

V1registerRouter.post("/",
    check("Authorization").exists().withMessage("Token is required"),
    check("lastname").exists().withMessage("Lastname is required"),
    check("firstname").exists().withMessage("Firstname is required"),
    check("company").exists().withMessage("Company name is required"), register);

V1registerRouter.post("/anonymously",
    check("Authorization").exists().withMessage("Tokens is required"),
    check("deviceKey").exists().withMessage("deviceKey is required"), registerAnonymously);

export default V1registerRouter;
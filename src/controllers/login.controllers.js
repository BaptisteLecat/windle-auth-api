import { BaseError } from "../errors/baseError.js";
import {
    canAssignDevice,
    insertUserJWT,
    userExist,
} from "../repository/userRepository.js";
import { generateAccessToken } from "../services/jwt/jwt.service.js";
import { authFirebaseUser } from "../services/firebase-admin/firebase.service.js";
import { validationResult } from "express-validator";
import { deviceExist, insertDevice } from "../repository/deviceRepository.js";

export const login = async(req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await authFirebaseUser(req.headers.authorization.split(" ")[1])
        .then(async(firebaseUser) => {
            await userExist(firebaseUser.uid).then(async(userExist) => {
                if (userExist) {
                    let token = generateAccessToken(firebaseUser.uid);
                    await canAssignDevice(firebaseUser.uid).then(
                        async(canAssignDevice) => {
                            if (canAssignDevice) {
                                await deviceExist(req.body.deviceKey).then(async(deviceId) => {
                                    if (deviceId == null || deviceId == 0) {
                                        await insertDevice(req.body.deviceKey).then(
                                            async(deviceInserted) => {
                                                if (
                                                    deviceInserted != undefined &&
                                                    deviceInserted != 0
                                                ) {
                                                    deviceId = deviceInserted;
                                                } else {
                                                    throw new BaseError(
                                                        "Server error",
                                                        500,
                                                        "Erreur lors de l'ajout de l'appareil."
                                                    );
                                                }
                                            }
                                        );
                                    }
                                    await insertUserJWT(firebaseUser.uid, token, deviceId)
                                        .then(() => {
                                            return res.status(200).json({
                                                uid: firebaseUser.uid,
                                                token: token,
                                            });
                                        })
                                        .catch((error) => {
                                            console.log("Error insert JWT");
                                            throw new BaseError(
                                                "Server error",
                                                500,
                                                "Erreur lors de la création du token."
                                            );
                                        });
                                });
                            } else {
                                throw new BaseError(
                                    "Server error",
                                    500,
                                    "La limite d'appareil est atteinte."
                                );
                            }
                        }
                    );
                } else {
                    throw new BaseError("Unauthorized", 404, "Utilisateur inconnu.");
                }
            });
        })
        .catch((err) => {
            next(err);
        });
};
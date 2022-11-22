import { BaseError } from "../errors/baseError.js";
import { userExist, updateAnonymousToUser, userIsAnonymous, createAnonymousUser, insertUserJWT } from "../repository/userRepository.js";
import { insertReseller } from "../repository/resellerRepository.js";
import { generateAccessToken } from "../services/jwt/jwt.service.js";
import { authFirebaseUser } from "../services/firebase-admin/firebase.service.js";
import { validationResult } from "express-validator";

export const register = async(req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    await authFirebaseUser(req.headers.authorization.split(" ")[1]).then(
        async(firebaseUser) => {
            await userIsAnonymous(firebaseUser.uid)
                .then(async(userIsAnonymous) => {
                    if (userIsAnonymous) {
                        await insertReseller(req.body.company)
                            .then(async(resellerId) => {
                                if (resellerId != undefined && resellerId != 0) {
                                    await updateAnonymousToUser(
                                            firebaseUser.uid,
                                            req.body.lastname,
                                            req.body.firstname,
                                            firebaseUser.email,
                                            resellerId
                                        )
                                        .then(async(userUpdated) => {
                                            if (userUpdated == true) {
                                                return res.status(201).json({
                                                    uid: firebaseUser.uid,
                                                    lastname: req.body.lastname,
                                                    firstname: req.body.firstname,
                                                    email: firebaseUser.email,
                                                    reseller: {
                                                        id: resellerId,
                                                    },
                                                });
                                            } else {
                                                throw new BaseError(
                                                    "Server error",
                                                    500,
                                                    "Erreur lors de la création de l'utilisateur"
                                                );
                                            }
                                        })
                                        .catch((err) => {
                                            next(err);
                                        });
                                } else {
                                    throw new BaseError(
                                        "Server error",
                                        500,
                                        "Erreur lors de la création du revendeur"
                                    );
                                }
                            })
                            .catch((err) => {
                                next(err);
                            });
                    } else {
                        throw new BaseError(
                            "Not Found",
                            404,
                            "Utilisateur inconnu."
                        );
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }
    );
}


export const registerAnonymously = async(req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await authFirebaseUser(req.headers.authorization.split(" ")[1])
        .then(async(firebaseUser) => {
            await userExist(firebaseUser.uid).then(
                async(userExist) => {
                    if (!userExist) {
                        await createAnonymousUser(
                            firebaseUser.uid
                        ).then(async(userCreated) => {
                            if (userCreated) {
                                let token = generateAccessToken(
                                    firebaseUser.uid
                                );
                                await canAssignDevice(firebaseUser.uid).then(
                                    async(canAssignDevice) => {
                                        if (canAssignDevice) {
                                            await deviceExist(
                                                req.body.deviceKey
                                            ).then(async(deviceId) => {
                                                if (deviceId == null || deviceId == 0) {
                                                    await insertDevice(
                                                        req.body.deviceKey
                                                    ).then(async(deviceInserted) => {
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
                                                    });
                                                }
                                                await insertUserJWT(
                                                        firebaseUser.uid,
                                                        token,
                                                        deviceId
                                                    )
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
                                throw new BaseError(
                                    "Conflict",
                                    409,
                                    "Cet utilisateur existe déjà."
                                );
                            }
                        });
                    } else {
                        throw new BaseError(
                            "Conflict",
                            409,
                            "Cet utilisateur existe déjà."
                        );
                    }
                }
            );
        })
        .catch((err) => {
            next(err);
        });
}
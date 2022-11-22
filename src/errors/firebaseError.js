import { BaseError } from "./baseError.js";

export const FirebaseError = class FirebaseError extends BaseError {
    constructor(title, statusCode = 500, description, firebaseCode) {
        super(
            title,
            statusCode,
            description != undefined && description != null ?
            description :
            "Error with Firebase Service."
        );
        this.firebaseCode = firebaseCode;
    }
};
import { verifyFirebaseToken } from "../../repository/verifyFirebaseToken.js";

// Authenticate a user from a token given by the client App.
// Return an UID.
export const authFirebaseUser = async(token) => {
    const user = await verifyFirebaseToken(token);
    if (user) {
        return user;
    } else {
        return null;
    }
};
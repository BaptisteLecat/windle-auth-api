import { pool } from "../services/database/database.service.js";

// Return true if a user is created.
// False if the user is already created.
export async function createAnonymousUser(uid) {
    let email = uid + "@windle-demo.fr";
    let lastname = "Anonymous";
    let firstname = "Anonymous";
    let status = 1;
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            connection.query(
                "INSERT INTO user(uid, lastname, firstname, email, roles, created_at, updated_at, status) VALUES (?, ?, ?, ?, '[]', now(), now(), ?) ON DUPLICATE KEY UPDATE uid = ?", [uid, lastname, firstname, email, status, uid],
                (err, result) => {
                    if (err) throw err;
                    // When done with the connection, release it.
                    connection.release();
                    if (result.insertId != undefined && result.insertId != 0) {
                        console.log(`Insert ${result.insertId} id`);
                        return resolve(true);
                    } else {
                        console.log(`User not inserted because already exist.`);
                        return resolve(false);
                    }

                    // Handle error after the release.
                    if (err) throw error;
                }
            );
        });
    });
}

export async function userExist(uid) {
    return new Promise(function(resolve, reject) {
        var userExist = false;
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "SELECT uid FROM user WHERE uid = ?", [uid],
                (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        userExist = true;
                    }
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (err) throw error;
                    return resolve(userExist);
                }
            );
        });
    });
}

export async function userIsAnonymous(uid) {
    let status = 2;
    return new Promise(function(resolve, reject) {
        var userExist = false;
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "SELECT uid FROM user WHERE uid = ? AND status = ?", [uid, status],
                (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        userExist = true;
                    }
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (err) throw error;
                    return resolve(userExist);
                }
            );
        });
    });
}

export async function canAssignDevice(uid) {
    return new Promise(function(resolve, reject) {
        var canAssignDevice = false;
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "SELECT user_uid FROM user_jwt_device WHERE user_uid = ?", [uid],
                (err, result) => {
                    if (err) throw err;
                    if (result.length >= 2) {
                        canAssignDevice = false;
                    } else {
                        canAssignDevice = true;
                    }
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (err) throw error;
                    return resolve(canAssignDevice);
                }
            );
        });
    });
}

// Return true if a user is created.
// False if the user is already created.
export async function updateAnonymousToUser(
    uid,
    lastname,
    firstname,
    email,
    company
) {
    let status = 2;
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "UPDATE user SET lastname = ?, firstname = ?, email = ?, reseller_id = ?,  status = ? WHERE uid = ?", [lastname, firstname, email, company, status, uid],
                (err, result) => {
                    if (err) throw err;
                    // When done with the connection, release it.
                    connection.release();
                    console.log("Anonymous user updated to user");
                    return resolve(true);

                    // Handle error after the release.
                    if (err) throw error;
                }
            );
        });
    });
}

export async function insertUserJWT(uid, jwt, deviceId) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(async function(err, connection) {
            if (err) throw err; // not connected!
            connection.query(
                "INSERT INTO user_jwt_device(user_uid, jwt, device_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE jwt = ?", [uid, jwt, deviceId, jwt],
                (err, result) => {
                    if (err) throw err;
                    console.log("JWT inserted");
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (err) throw error;
                    return resolve();
                }
            );
        });
    });
}
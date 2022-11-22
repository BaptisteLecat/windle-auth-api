import { pool } from "../services/database/database.service.js";

export async function insertDevice(deviceKey) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "INSERT INTO device(device_key) VALUES (?)", [deviceKey],
                (err, result) => {
                    if (err) throw err;
                    // When done with the connection, release it.
                    connection.release();
                    if (result.insertId != undefined && result.insertId != 0) {
                        console.log(`Insert device ${result.insertId} id`);
                        return resolve(result.insertId);
                    } else {
                        console.log(`Device not inserted because already exist.`);
                        return resolve(false);
                    }

                    // Handle error after the release.
                    if (err) throw error;
                }
            );
        });
    });
}

export async function deviceExist(deviceKey) {
    return new Promise(function(resolve, reject) {
        var deviceId = null;
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "SELECT id FROM device WHERE device_key = ?", [deviceKey],
                (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        deviceId = result[0].id;
                    }
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (err) throw error;
                    return resolve(deviceId);
                }
            );
        });
    });
}
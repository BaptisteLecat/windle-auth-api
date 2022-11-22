import { pool } from "../services/database/database.service.js";

export async function insertReseller(company) {
    let status = 2;
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query(
                "INSERT INTO reseller(company, created_at, updated_at) VALUES (?, now(), now())", [company],
                (err, result) => {
                    if (err) throw err;
                    // When done with the connection, release it.
                    connection.release();
                    if (result.insertId != undefined && result.insertId != 0) {
                        console.log(`Insert ${result.insertId} id`);
                        return resolve(result.insertId);
                    } else {
                        console.log(`Reseller not inserted because already exist.`);
                        return resolve(false);
                    }

                    // Handle error after the release.
                    if (err) throw error;
                }
            );
        });
    });
}
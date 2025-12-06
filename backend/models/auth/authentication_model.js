import pool from "../../config/db.js";

async function getUserByUsername(username) {
    const query = `SELECT * FROM users WHERE username = ?`;
    const values = [username];

    return pool.execute(query, values).then(([rows]) => {
        return rows[0];
    });
}

export default getUserByUsername;
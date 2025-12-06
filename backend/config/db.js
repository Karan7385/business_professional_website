import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Karan@7385",
  database: process.env.DB_NAME || "pt_indo_business_exports",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Log status on server startup
pool.getConnection()
  .then(() => console.log("🔗 MySQL connected successfully"))
  .catch((err) => console.error("❌ MySQL connection failed:", err.message));


export default pool;
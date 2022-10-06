import mysql from "mysql";
import env from "dotenv";
env.config();
const mysqlConnection = mysql.createConnection({
  host: process.env.host,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  insecureAuth: true,
  multipleStatements: true,
});

export default mysqlConnection;

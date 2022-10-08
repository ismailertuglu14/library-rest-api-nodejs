import mysql from "mysql";
import express from "express";
import bodyParser from "body-parser";
import bookRoutes from "./src/product/book/routes/book_routes.js";
import authRoutes from "./src/product/auth/routes/auth_routes.js";
import mysqlConnection from "./src/core/connection/mysql.connection.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();
app.use("/api/book", bookRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3300;

mysqlConnection.connect((err) => {
  if (!err) return console.log("Db successfully connected!");

  console.log("Db connection failed" + JSON.stringify(err, undefined, 2));
});

app.listen(PORT, () => {
  console.log("Express server is running at port " + PORT);
});

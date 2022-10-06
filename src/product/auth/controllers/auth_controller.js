import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import mysqlConnection from "../../../core/connection/mysql.connection.js";
//import userMiddleware from "../../../core/middleware/user_middleware.js";

export function signUp(req, res, next) {
  mysqlConnection.query(
    `SELECT id from users where LOWER(users.Username) = LOWER(${req.body.username})`,
    (err, result) => {
      if (result != null) {
        //Error
        return res.status(409).json({
          success: false,
          status: res.statusCode,
          message: "This usename is already in use!",
        });
      }
      // username not in use
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              success: false,
              status: res.statusCode,
              message: err.message,
            });
          } else {
            console.log(hash);
            mysqlConnection.query(
              `INSERT INTO users (id,username,password,registered) VALUES ("${uuidv4()}",${mysqlConnection.escape(
                req.body.username
              )},"${hash}",now())`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    message: err.message,
                  });
                }
                return res.status(201).send({
                  message: "Registered!",
                });
              }
            );
          }
        });
      }
    }
  );
}
export function login(req, res, next) {
  debugger;
  mysqlConnection.query(
    `SELECT * FROM Users WHERE Username = ${mysqlConnection.escape(
      req.body.username
    )};`,
    (err, result) => {
      console.log(result);
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!result.length) {
        return res.status(400).json({
          message: "Username or password incorrect!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["Password"],
        (bErr, bResult) => {
          if (bErr) {
            res.status(400).json({
              message: "Username or password incorrect!",
            });
          }
          if (bResult) {
            //password match
            const token = jwt.sign(
              {
                username: result[0].Username,
                userId: result[0].Id,
                type: result[0].Type,
              },
              "SECRETKEY",
              { expiresIn: "7d" }
            );
            mysqlConnection.query(
              `Update users SET Last_Login = now() where Id = "${result[0].Id}";`
            );
            return res.status(200).json({
              success: true,
              status: res.statusCode,
              message: "Logged in succesfully!",
              token,
              user: result[0],
            });
          }
          return res.status(401).json({
            success: false,
            status: res.statusCode,
            message: "Username or password incorrect!",
          });
        }
      );
    }
  );
}
export function secretRoute(req, res, next) {
  res.json("this is a secret route");
}

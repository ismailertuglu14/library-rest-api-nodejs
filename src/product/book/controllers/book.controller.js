import mysql from "mysql";
import mysqlConnection from "../../../core/connection/mysql.connection.js";
import { BookModel } from "../models/book_model.js";
//GET ALL BOOKS
export function getBooks(req, res) {
  const limit = req.query.limit;

  mysqlConnection.query("SELECT * FROM Books", (err, rows, fields) => {
    if (err) return;
    console.log(rows);
    res.status(200).json(rows);
  });
}
//router.get("/booksLimit", getBooksByLimit);

//GET BOOKS BY LIMIT
export function getBooksByPage(req, res) {
  const page = req.query.page; // Current Page
  const limitCount = 6; // How many books in 1 time

  mysqlConnection.query(
    `SELECT * FROM Books limit ${limitCount} offset ${(page - 1) * limitCount}`,
    (err, rows, fields) => {
      if (err) return;

      console.log(rows);
      res.status(200).json(rows);
    }
  );
}

// Get Book By Book Id
export function getBookById(req, res) {
  mysqlConnection.query(
    `
    SELECT * FROM Books where Books.Id = ?
    `,
    [req.params.id],
    (err, row, fields) => {
      console.log(row);
      res.status(200).json(row);
    }
  );
}
//Get book By Name
export function getBookByName(req, res) {
  const name = req.query.name;
  try {
    mysqlConnection.query(
      `
      SELECT * FROM library.books where Name Like '%${name}%'
      `,
      (err, rows, fields) => {
        res.status(200).json({ status: res.statusCode, rows });
      }
    );
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
export function createOrUpdateBook(req, res) {
  try {
    const { Id, Name, Description, Author, Image } = req.body;
    // INSERT INTO DATABASE CODES
    // If Id equals to 0 then Create a new Row
    // If Id not equals to 0 then Update selected Id's Row
    var sql =
      "SET @Id = ?;SET @Name = ?;SET @Description = ?;SET @Authors_Id = ?; SET @Image = ?;\
  CALL AddOrUpdate(@Id,@Name,@Description,@Authors_Id,@Image);";
    const x = mysqlConnection.query(
      sql,
      [Id, Name, Description, Author, Image],
      (err, rows, fields) => {
        if (err) {
          return res.status(400).json({
            success: false,
            status: res.statusCode,
            message: err.message,
          });
        } else {
          const book = new BookModel(
            rows[5][0].Id,
            Name,
            Description,
            Author,
            Image
          );
          return res.status(200).json({
            success: true,
            status: res.statusCode,
            message: "Book has been created Succesfully!",
            book: JSON.parse(JSON.stringify(book)),
          });
        }
      }
    );
  } catch (error) {
    res
      .status(400)
      .json({ success: false, status: res.statusCode, message: error.message });
  }
}
export function deleteBookById(req, res) {
  mysqlConnection.query(
    "DELETE From Books WHERE Id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (err) return console.log(err);
      res.send("Deleted successfully");
    }
  );
}
//
export function getDatabaseData(req, res) {
  mysqlConnection.query(`SELECT * FROM library_data`, (err, row, fields) => {
    if (err) return console.log(err.message);
    console.log(row);
    res.status(200).json(row);
  });
}

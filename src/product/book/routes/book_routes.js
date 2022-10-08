import express from "express";
import {
  isAdmin,
  isLoggedIn,
} from "../../../core/middleware/user_middleware.js";
import {
  createOrUpdateBook,
  deleteBookById,
  getBookById,
  getBookByName,
  getBooks,
  getBooksByPage,
  getDatabaseData,
} from "../controllers/book.controller.js";
const router = express.Router();

router.get("/all", isAdmin, getBooks);

router.get("/", getBooksByPage);

router.get("/getdatabasedata", getDatabaseData);

router.get("/id/:id", getBookById);
router.get("/search", getBookByName);

router.post("/create", isAdmin, createOrUpdateBook);
router.delete("/:id", isAdmin, deleteBookById);

export default router;

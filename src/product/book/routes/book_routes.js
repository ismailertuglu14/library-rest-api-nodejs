import express from "express";
import {
  isAdmin,
  isLoggedIn,
} from "../../../core/middleware/user_middleware.js";
import {
  createOrUpdateBook,
  deleteBookById,
  getBookById,
  getBooks,
  getBooksByPage,
} from "../controllers/book.controller.js";
const router = express.Router();
// Get all books in db
router.get("/all", isLoggedIn, getBooks);
// Pagination
router.get("/", getBooksByPage);
// Selected book
router.get("/:id", getBookById);
// Create or Update
router.post("/create", isAdmin, createOrUpdateBook);
// Delete
router.delete("/:id", isAdmin, deleteBookById);
export default router;

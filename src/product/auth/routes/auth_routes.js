import express, { application } from "express";
import {
  isLoggedIn,
  validateRegister,
} from "../../../core/middleware/user_middleware.js";
import { login, secretRoute, signUp } from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", validateRegister, signUp);
router.get("/secret-route", isLoggedIn, secretRoute);
export default router;

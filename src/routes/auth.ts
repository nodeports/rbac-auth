import express from "express";
import { registerUser, loginUser } from "../controllers/auth";
import { protect, authorize } from "../middlewares/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.send("Admin content");
});

router.get("/user", protect, authorize("user", "admin"), (req, res) => {
  res.send("User content");
});

export default router;

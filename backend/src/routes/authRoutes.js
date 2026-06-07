const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, changePassword, forgotPassword } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/admin/change-password", protect, adminOnly, changePassword);

module.exports = router;
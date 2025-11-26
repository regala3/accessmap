import express from "express";
import { signup, login, logout, updateProfile, checkAuth, forgotPassword, resetPassword, inviteNewVendor, inviteExistingVendor, signupVendor } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/vendor-signup/:stallId", signupVendor)

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/:stallId/signup-vendor-email", inviteNewVendor);

router.post("/:stallId/notify-vendor-email", inviteExistingVendor);

export default router;
import express from "express";
import { createUserProfileController, getTotalUsersController, getMyProfileController } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-user-profile", createUserProfileController);
router.get("/get-total-users", getTotalUsersController);
// Current user's profile derived from token
router.get("/me", requireAuth, getMyProfileController);


export default router;

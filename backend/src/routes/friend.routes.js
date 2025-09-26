import express from "express";
import { addFriend, removeFriend, getFriends, makeFriends } from "../controllers/friend.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add/:friendId", isAuthenticated, addFriend);
router.post("/remove/:friendId", isAuthenticated, removeFriend);
router.get("/all", isAuthenticated, getFriends);      
router.get("/suggestions", isAuthenticated, makeFriends); 
export default router;

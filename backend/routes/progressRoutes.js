import express from "express";
const router=express.Router();
import { getDashboard } from "../controllers/progressController.js";

import  protect from '../middleware/auth.js'

router.get("/dashboard", protect ,getDashboard);

export default router;

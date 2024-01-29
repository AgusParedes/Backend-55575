import Router from "express";
import { resetPassword }  from "../controllers/resetPassword.controller.js"

const router = Router();

router.post ('/', resetPassword)

export default router
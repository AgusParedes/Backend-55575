import Router from "express";
import { authorization } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import { Login, Register, RenderHome } from "../controllers/views.controllers.js";

const router = Router();

router.get ('/register', Register) 
router.get ('/', Login) 
router.get('/home', RenderHome);

export default router
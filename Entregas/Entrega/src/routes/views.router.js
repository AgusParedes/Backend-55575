import Router from "express";
import { authorization } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import { Login, Register, RenderHome } from "../controllers/views.controllers.js";

const router = Router();

router.get ('/register', Register) 
router.get ('/login', Login) 
router.get('/', passportCall('jwt'),authorization('user','premium', 'admin'), RenderHome);

export default router
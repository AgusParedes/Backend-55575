import Router from "express";
import { authorization } from "../utils.js";
import { passportCall } from "../config/passport.config.js";
import {ShowUserInfo} from "../controllers/current.controllers.js"

const router = Router();

router.get('/', passportCall('jwt'),authorization('user'), ShowUserInfo);

export default router;
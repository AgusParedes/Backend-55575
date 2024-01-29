import Router from "express";
import { ChangeUserRole } from "../controllers/user.controller.js";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../utils.js";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.put('/premium/:uid', passportCall('jwt'), authorization('admin'), ChangeUserRole);

export default router;

import Router from "express";
import { ChangeUserRole, GetUsers, RenderEditUsers, DeleteUser, CleanInactiveUsers } from "../controllers/user.controller.js";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../utils.js";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.put('/premium/:uid', passportCall('jwt'), authorization('admin'), ChangeUserRole);
router.get('/', GetUsers); 
router.delete('/', CleanInactiveUsers)
router.get('/editUser', passportCall('jwt'), authorization('admin'), RenderEditUsers );
router.delete('/:uid', DeleteUser);

export default router;

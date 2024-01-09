import { Router } from 'express';
import passport from 'passport';
import { Login, Register, Logout, Github, Github_callback, MockUsers } from '../controllers/sessions.controllers.js';
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.post('/register', Register)
router.post('/login', Login);
router.get('/logout', Logout);
router.get('/github', passport.authenticate('github', {scope: ['user:email']}), Github);
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), Github_callback);
router.get('/mockingproducts', MockUsers)

export default router;
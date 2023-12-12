import { Router } from 'express';
import passport from 'passport';
import { Login, Register, Logout, Github, Github_callback } from '../controllers/sessions.controllers.js';

const router = Router();

router.post('/register', Register)
router.post('/login', Login);
router.get('/logout', Logout);
router.get('/github', passport.authenticate('github', {scope: ['user:email']}), Github);
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), Github_callback);

export default router;
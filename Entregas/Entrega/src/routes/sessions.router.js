import { Router } from 'express';
import usersModel from '../dao/dbManagers/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect: 'fail-register'}), async (req, res) => {
   res.status(201).send({ status: 'success', message: 'correctly registered user' });
});


router.get('/fail-register', async (req, res) => {
   res.status(500).send({ status: 'error', message: 'register fail' });
});


router.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
   if(!req.user) {
      return res.status(401).send({ status: 'error', message: 'invalid credentials' })
   }

   if (req.user.email === "adminCoder@coder.com"){
      req.session.user = {
         name: `${req.user.first_name} ${req.user.last_name}`,
         email: req.user.email,
         age: req.user.age,
         role: "admin"
      }
   }else{
      req.session.user = {
         name: `${req.user.first_name} ${req.user.last_name}`,
         email: req.user.email,
         age: req.user.age,
         role: "usuario"
   }

   res.send({ status: 'success', message: 'login success' })
}});

router.get('/fail-login', async (req, res) => {
   res.status(500).send({ status: 'error', message: 'login fail' });
});


router.get('/logout', (req, res) => {
   req.session.destroy(error => {
      if(error) return res.status(500).send({ status: 'error', message: error.message });
      res.redirect('/');
   })
});


router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {
   res.send({ status: 'success', message: 'user registered' });
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
   req.session.user = req.user;
   res.redirect('/');
});

export default router;
import { Router } from 'express';
import passport from 'passport';
import Users from '../dao/dbManagers/users.manager.js';
import { cartsModel } from '../dao/dbManagers/models/carts.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';
import { usersModel } from '../dao/dbManagers/models/user.model.js';

const router = Router();
const userManager = new Users();

router.post('/register', async (req, res) => {
   try {
      const { first_name, last_name, age, role, email, password } = req.body;
      const user = await userManager.getByEmail(email);
      console.log(user);

      if (user) {
         return res.status(400).send({ status: 'error', message: 'User already exists' });
      }

      const cart = await cartsModel.create({ products: [] });

      const userToSave = new usersModel({
         first_name,
         last_name,
         email,
         age,
         password: createHash(password),
         role,
         cart: cart._id
      });

      await userToSave.save();

      console.log(userToSave);
      console.log(cart);

      res.status(201).send({ status: 'success', userToSave });
   } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
   }
});

router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await userManager.getByEmail(email);
      if (!user || !isValidPassword(password, user.password)) {
         return res.status(401).send({ status: 'error', message: 'invalid credentials' });
      }
      const { password: _, ...userResult } = user;
      const accessToken = generateToken(userResult);
      res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })
   } catch (error) {
      console.error('Error en la ruta de inicio de sesión:', error);
      res.status(500).send({ status: 'error', message: 'Internal server error' });
   }
});

router.get('/logout', (req, res) => {
   req.session.destroy(error => {
      if(error) return res.status(500).send({ status: 'error', message: error.message });
      res.redirect('/login');
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
import Router from "express";
import { productsModel } from '../dao/dbManagers/models/product.model.js'
import { usersModel } from "../dao/dbManagers/models/user.model.js";
import { authorization } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { passportCall } from "../config/passport.config.js";
import Users from "../dao/dbManagers/users.manager.js";

   const router = Router();
   const userManager = new Users();

   router.get ('/register',async (req, res) => {
   res.render('register')
}) 

   router.get ('/login',async (req, res) => {
   res.render('login')
}) 

router.get('/', passportCall('jwt'),authorization('user'), async (req, res) => {
   try {
      console.log(req.user); 
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const user = req.user;

      const userData = await usersModel.findById(user.id);

      const result = await productsModel.paginate(query, { limit, page, sort });
      const cartId = user.cart;
      const products = result.docs.map(doc => doc.toObject());

      res.render('products', { products, cartId, total: result.total, limit, page, user: req.user });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});

export default router
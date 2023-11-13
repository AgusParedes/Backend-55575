import { Router } from 'express';
import { productsModel } from '../dao/dbManagers/models/product.model.js'
const router = Router();

const publicAccess = (req, res, next) => {
   if(req.session?.user) return res.redirect('/');
   next();
}

const privateAccess = (req, res, next) => {
   if(!req.session?.user) return res.redirect('/login');
   next()
}

router.get('/register', publicAccess, (req, res) => {
   res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
   res.render('login')
});

router.get('/', privateAccess, async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const result = await productsModel.paginate(query, { limit: limit, page: page, sort: sort });
      const cartId = "6544ff9dc4c37454e83065e8";
      const products = result.docs.map(doc => doc.toObject());
      console.log(products);
      res.render('products', { products, cartId, total: result.total, limit, page, user: req.session.user });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});


export default router;
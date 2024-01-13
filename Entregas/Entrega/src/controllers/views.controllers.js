import { RenderHome as RenderHomeService } from "../services/views.services.js" 

const Register = async (req, res) => {
   res.render('register')
}

const Login = async (req, res) => {
   res.render('login')
}

const RenderHome = async (req, res) => {
   try { 
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const user = req.user;

      const { products, cartId, result } = await RenderHomeService(limit, page, query, sort, user);
      res.render('products', { products, cartId, total: result.total, limit, page, user: req.user });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

export {
   Register,
   Login,
   RenderHome
}
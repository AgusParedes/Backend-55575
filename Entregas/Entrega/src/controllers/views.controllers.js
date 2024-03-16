import { RenderHome as RenderHomeService } from "../services/views.services.js" 

const Register = async (req, res) => {
   try {
      res.render('register');
   } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al renderizar la vista de registro: ' + error.message });
      
   }
}

const Login = async (req, res) => {
   try {
      res.render('login');
   } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al renderizar la vista de inicio de sesión: ' + error.message });
      console.log(error.message)
      console.log(error)
   }
}

const RenderHome = async (req, res) => {
   if (!req.user) {
      return res.redirect('/login');
   }
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
import Router from "./router.js";
// import ProductManager from '../managers/product.manager.js'
import Products from '../dao/dbManagers/product.manager.js'
import { productsModel } from '../dao/dbManagers/models/product.model.js'
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class CartsRouter extends Router {
   constructor() {
      super();
      this.productManager = new Products();
   }

   init() {
      this.get('/home', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.RenderHome);
      this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.GetInfoPages);
      this.get('/products', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.RenderProductsWithQuerys);
      this.get('/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.GetById);
      this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.NewProduct);
      this.put('/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.EditProduct);
      this.delete('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.DeleteProduct);
   }   
   
async RenderHome (req, res) {
   res.render('home');
}

async GetInfoPages (req, res) {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const result = await productsModel.paginate( query, { limit: limit, page: page, sort: sort});
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < result.totalPages ? page + 1 : null;
      const prevLink = prevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}&query=${JSON.stringify(query)}&sort=${JSON.stringify(sort)}` : null;
      const nextLink = nextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}&query=${JSON.stringify(query)}&sort=${JSON.stringify(sort)}` : null;

      const response = {
         status: 'success',
         payload: result.docs,
         totalPages: result.totalPages,
         prevPage: prevPage,
         nextPage: nextPage,
         page: result.page,
         hasPrevPage: result.hasPrevPage,
         hasNextPage: result.hasNextPage,
         prevLink: prevLink,
         nextLink: nextLink
      };
      res.send({ status: 'success', payload: response });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
}

async RenderProductsWithQuerys (req, res) {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const result = await productsModel.paginate(query, { limit: limit, page: page, sort: sort });
      const cartId = "6544ff9dc4c37454e83065e8";
      const products = result.docs.map(doc => doc.toObject());
      res.render('products', { products, cartId, total: result.total, limit, page });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
}

async GetById (req, res) {
   try{
      const { pid } = req.params;
      const product = await this.productManager.getById(pid);
      res.send({ status: 'success', payload: product });
   }
   catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
}

async NewProduct (req, res) {
   try {
      const { title, description, code, price, status = true, stock, category, thumbnail } = req.body;

      if(!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
         return res.status(400).send({ status: 'error', message: 'incomplete values' });
      }

      const result = await this.productManager.save({
         title, 
         description, 
         code, 
         price, 
         status : true, 
         stock, 
         category, 
         thumbnail
      });
      res.status(201).send({ status: 'success', payload: result });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
}

async EditProduct (req, res) {
   try {
      const { pid } = req.params;
      const updatedFields = req.body;
      const updatedProduct = await this.productManager.update(pid, updatedFields);
      res.send({ status: 'success', payload: updatedProduct });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
}

async DeleteProduct (req, res) {
   try {
      const { pid } = req.params;
      const result = await this.productManager.delete(pid);
      res.send({ status: 'success', payload: result });
   } catch (error) {
      res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
   }
}

};

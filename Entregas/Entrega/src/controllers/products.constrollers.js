import { GetInfoPages as GetInfoPagesService,
         RenderProductsWithQuerys as RenderProductsWithQuerysService,
         GetById as GetByIdService,
         NewProduct as NewProductService,
         EditProduct as EditProductService,
         DeleteProduct as DeleteProductService,
         getAllProducts as getAllProductsService } from "../services/products.services.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const RenderHome = async (req, res) => {
   try {
      const products = await getAllProductsService();
      res.render('home', { products });
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
}

const GetInfoPages = async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const response = await GetInfoPagesService(limit, page, query, sort)

      res.send({ status: 'success', payload: response });
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
}

const RenderProductsWithQuerys = async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const user = req.user;

      const { products, cartId, result } = await RenderProductsWithQuerysService(limit, page, query, sort, user)
      
      res.render('products', { products, cartId, total: result.total, limit, page });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const GetById = async (req, res) => {
      const { pid } = req.params;
      const product = await GetByIdService(pid)
      res.send({ status: 'success', payload: product });
   
}

const NewProduct = async (req, res) => {
      const { title, description, code, price, status = true, stock, category, thumbnail} = req.body;
      let owner = req.user.email;
      if (!(req.user.role === 'premium')) {
         owner = "admin";
      }
      if (!title || !description || !code || !price || !status || !stock || !category){
         throw CustomError.createError({
            name: 'ProductError',
            cause: 'Invalid data types',
            message: 'Error trying to create product',
            code: EErrors.INVALID_TYPE_ERROR
         })
      }
      const result = await NewProductService(title, description, code, price, status, stock, category, thumbnail, owner);
      res.status(201).send({ status: 'success', payload: result });
}

const EditProduct = async (req, res) => {
   try {
      const { pid } = req.params;
      const updatedFields = req.body;
      const updatedProduct = await EditProductService(pid, updatedFields)
      res.send({ status: 'success', payload: updatedProduct });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
      req.logger.error(error.message);
   }
}

const DeleteProduct = async (req, res) => {

      const { pid } = req.params;
      const userRole = req.user.role;
      console.log(userRole)
      if (userRole === 'admin') {
         const result = await DeleteProductService(pid)
         res.send({ status: 'success', payload: result });
      } else if (userRole === 'premium') {
         const product = await GetByIdService(pid);
         if (product.owner === req.user.email) { 
            const result = await DeleteProductService(pid)
            res.send({ status: 'success', payload: result });
         } else {
            throw CustomError.createError({
               name: 'UserError',
               cause: 'Permission denied',
               message: 'You are not allowed to delete this product',
               code: EErrors.PERMISSION_DENIED
            })
         }
      } else {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Invalid user role',
            message: 'You do not have the necessary permissions to perform this action',
            code: EErrors.PERMISSION_DENIED
         })
      }
}



export {
RenderHome,
GetInfoPages,
RenderProductsWithQuerys,
GetById,
NewProduct,
EditProduct,
DeleteProduct
}
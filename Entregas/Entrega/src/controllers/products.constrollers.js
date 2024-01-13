import { GetInfoPages as GetInfoPagesService,
         RenderProductsWithQuerys as RenderProductsWithQuerysService,
         GetById as GetByIdService,
         NewProduct as NewProductService,
         EditProduct as EditProductService,
         DeleteProduct as DeleteProductService } from "../services/products.services.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const RenderHome = async (req, res) => {
   try {
      res.render('home');
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
      const { title, description, code, price, status = true, stock, category, thumbnail } = req.body;
      if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail){
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Invalid data types, first_name, last_name and email required',
            message: 'Error trying to create user',
            code: EErrors.INVALID_TYPE_ERROR
         })
      }
      const result = await NewProductService(title, description, code, price, status, stock, category, thumbnail);
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
   try {
      const { pid } = req.params;
      const result = await DeleteProductService(pid)
      res.send({ status: 'success', payload: result });
   } catch (error) {
      res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
      req.logger.error(error.message);
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
import Products from '../dao/dbManagers/product.manager.js'
import ProductRepository from "../repositories/product.reposity.js"
import { productsModel } from '../dao/dbManagers/models/product.model.js'
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const productDao = new Products();
const productRepository = new ProductRepository(productDao);

const GetInfoPages = async (limit, page, query, sort) => {

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
      return response
   }

const RenderProductsWithQuerys = async (limit, page, query, sort, user) => {
      const result = await productsModel.paginate(query, { limit: limit, page: page, sort: sort });
      const cartId = user.cart;
      const products = result.docs.map(doc => doc.toObject());
      return { products, cartId, result };
   }

const GetById = async (pid) => {
      const product = await productRepository.getProductById(pid);
      if (!product) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Product not found',
            message: 'Error trying to searching the Product',
            code: EErrors.PRODUCT_NOT_FOUND
         })
      }
      return product;
   }
   
const NewProduct = async (title, description, code, price, status = true, stock, category, thumbnail, owner) => {
      const product = {
         title, 
         description, 
         code, 
         price, 
         status, 
         stock, 
         category, 
         thumbnail,
         owner
      }
      const result = await productRepository.CreateProduct(product);
      return result;
   }

const EditProduct = async (pid, updatedFields) => {
      const updatedProduct = await productRepository.updateProduct(pid, updatedFields);
      return updatedProduct;
   }

const DeleteProduct = async (pid) => {
      const result = await productRepository.deleteProduct(pid);
      return result;
   }

const getAllProducts = async () => {
      const products = productRepository.getAllProducts()
      return  products 
   }
export {
   GetInfoPages,
   RenderProductsWithQuerys,
   GetById,
   NewProduct,
   EditProduct,
   DeleteProduct,
   getAllProducts
}
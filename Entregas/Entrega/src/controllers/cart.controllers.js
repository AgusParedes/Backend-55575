import { CreateCart as CreateCartService, 
         AddProductToCart as AddProductToCartService, 
         DeleteProductToCart as DeleteProductToCartService,
         EditCart as EditCartService,
         EditProductQuantity as EditProductQuantityService,
         GetCartById as GetCartByIdService,
         DeleteCart as DeleteCartService } from "../services/carts.services.js";
import { GetById as GetByIdService } from "../services/products.services.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const CreateCart = async (req, res) => {
   try {
      const result = await CreateCartService();
      res.send({ payload: result });
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
};

const AddProductToCart = async (req, res) => {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const userRole = req.user.role;
      const product = await GetByIdService(productId); 

      if (userRole === 'premium' && product.owner === req.user.email) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Permission denied',
            message: 'You are not allowed to add your own product to your cart',
            code: EErrors.PERMISSION_DENIED
         });
      }

      const cart = await AddProductToCartService(cartId, productId);
      res.send({ payload: cart });
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
};


const DeleteProductToCart = async (req, res) => {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cart = await DeleteProductToCartService(cartId, productId);

      res.send({ payload: cart })
};

const EditCart = async (req, res) => {
   try {
      const cartId = req.params.cid;
      const newProducts = req.body;

      await EditCartService(cartId, newProducts)

      res.status(200).send('Carrito actualizado');
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
};

const EditProductQuantity = async (req, res) => {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      await EditProductQuantityService(cartId, productId, newQuantity)

      res.status(200).send('Cantidad de producto actualizada');
};

const GetCartById = async (req, res) => {
   try {
      const cartId = req.params.cid;
      const products = await GetCartByIdService(cartId);
      console.log(cartId)
      console.log(products)
      res.render('cart', { cartId, products });
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
      
};


const DeleteCart = async (req, res) => {
   try {
      const cartId = req.params.cid;

      await DeleteCartService(cartId);

      res.status(200).send('Carrito eliminado');
   } catch (error) {
      res.status(500).send({ error: error.message });
      req.logger.error(error.message);
   }
};

export{
   CreateCart, 
   AddProductToCart, 
   DeleteProductToCart,
   EditCart, 
   EditProductQuantity, 
   GetCartById, 
   DeleteCart
}

import Carts from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/cart.repository.js";
import PaymentService from "../services/payment.service.js";
import { GetCartById as GetCartByIdService } from "../services/carts.services.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';
import Products from '../dao/dbManagers/product.manager.js'
import ProductRepository from "../repositories/product.reposity.js"

const productDao = new Products();
const productRepository = new ProductRepository(productDao);
const cartDao = new Carts();
const cartRepository = new CartRepository(cartDao)

const CreatePaymentIntent = async (req, res) => {
   const CartToBuy = await cartRepository.getCartById(req.query.id)
   let totalPrice = 0;

   await Promise.all(CartToBuy.products.map(async (productItem) => {
      const product = await productRepository.getProductById(productItem._id);
      console.log(product);
  
      const productTotal = product.price * productItem.quantity;
      console.log(productTotal);
      console.log(productItem.quantity);
  
      totalPrice += productTotal;
   }));

   if (!CartToBuy) 
   throw CustomError.createError({
      name: 'UserError',
      cause: 'Cart not found',
      message: 'Error trying to searching the cart',
      code: EErrors.CART_NOT_FOUND
   });


   const paymentIntentInfo = {
      amount: totalPrice, 
      currency: 'usd'
   };

   const paymentService = new PaymentService();
   const result = await paymentService.createPaymentIntent(paymentIntentInfo);
   console.log(result);
   res.send({ status: 'success', payload: result });
};

const RenderPaymentIntent = async (req, res) => {
   const CartId = req.query.id
   const products = await GetCartByIdService(CartId);
   res.render('payment', { CartId, products });
}

export{
   CreatePaymentIntent,
   RenderPaymentIntent
}
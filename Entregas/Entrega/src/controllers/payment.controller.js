import Carts from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/cart.repository.js";
import PaymentService from "../services/payment.service.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const cartDao = new Carts();
const cartRepository = new CartRepository(cartDao)

const CreatePaymentIntent = async (req, res) => {
   const productToBuy = await cartRepository.getCartById(req.query.id)
   if (!productToBuy) 
   throw CustomError.createError({
      name: 'UserError',
      cause: 'Cart not found',
      message: 'Error trying to searching the cart',
      code: EErrors.CART_NOT_FOUND
   });


   const paymentIntentInfo = {
      amount: productToBuy.price, 
      currency: 'usd'
   };

   const paymentService = new PaymentService();
   const result = await paymentService.createPaymentIntent(paymentIntentInfo);
   console.log(result);
   res.send({ status: 'success', payload: productToBuy });
};

export{
   CreatePaymentIntent
}
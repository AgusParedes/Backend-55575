import Carts from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/cart.repository.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const cartDao = new Carts();
const cartRepository = new CartRepository(cartDao)

const CreateCart = async () => {
   const newCart = cartRepository.createCart();
   return newCart
}

const AddProductToCart = async (cartId, productId) => {
   const cart = await cartRepository.getCartById(cartId);
   if (!cart) {
      throw CustomError.createError({
         name: 'UserError',
         cause: 'Cart not found',
         message: 'Error trying to searching the cart',
         code: EErrors.CART_NOT_FOUND
      })
   }
      const products = cart.products;

      const productIndexInCart = products.findIndex(product => 
         product.product && product.product.toString() === productId.toString()
      );
      console.log(productIndexInCart)

      if (productIndexInCart !== -1) {
         products[productIndexInCart].quantity++;
      } else {
         products.push({ product: productId, quantity: 1 });
      }
      await cartRepository.updateCart(cartId, products);

   return cart;
};



const DeleteProductToCart = async (CartId, productId) => {
   const cart = await cartRepository.getCartById(CartId);
   if (!cart) {
      throw CustomError.createError({
         name: 'UserError',
         cause: 'Cart not found',
         message: 'Error trying to searching the cart',
         code: EErrors.CART_NOT_FOUND
      })
   }
      const products = cart.products;
      const indexProductInCart = products.findIndex(product => 
         product.product && product.product.toString() === productId.toString()
      );

      if (indexProductInCart !== -1) {
         products.splice(indexProductInCart, 1);
      }
      await cartRepository.updateCart(CartId, products);
      return cart;
   
}

const EditCart = async (cartId, newProducts) => {
   await cartRepository.updateCart(cartId, newProducts);
}

const EditProductQuantity = async (cartId, productId, newQuantity) => {
   const cart = await cartRepository.getCartById(cartId);
   if (!cart) {
      throw CustomError.createError({
         name: 'UserError',
         cause: 'Cart not found',
         message: 'Error trying to searching the cart',
         code: EErrors.CART_NOT_FOUND
      })
   }
      const products = cart.products;
      const indexProductInCart = products.findIndex(product => 
         product.product && product.product.toString() === productId.toString()
      );
      if (indexProductInCart !== -1) {
         products[indexProductInCart].quantity = newQuantity;
      }
      cartRepository.updateCart(cartId, products );
   
}

const GetCartById = async (cartId) => {
   const cart = await cartRepository.getCartById(cartId);
   if (!cart) {
      throw CustomError.createError({
         name: 'UserError',
         cause: 'Cart not found',
         message: 'Error trying to searching the cart',
         code: EErrors.CART_NOT_FOUND
      })
   }
   const products = cart.products.map(products => ({
      product: products.product._id, 
      quantity: products.quantity,
      title : products.product.title, 
      description : products.product.description,
      code : products.product.code,
      price : products.product.price,
      status : products.product.status,
      stock : products.product.stock,
      category : products.product.category,
      thumbnail : products.product.thumbnail
   }));
   return products
}

const DeleteCart = async (cartId) => {
   await cartRepository.deleteCart(cartId);
}
export {
   CreateCart,
   AddProductToCart,
   DeleteProductToCart,
   EditCart,
   EditProductQuantity,
   GetCartById,
   DeleteCart
}
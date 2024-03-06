import Carts from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/cart.repository.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';
import Products from '../dao/dbManagers/product.manager.js'
import ProductRepository from "../repositories/product.reposity.js"

const productDao = new Products();
const productRepository = new ProductRepository(productDao);
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
      if (!products) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Product not found',
            message: 'Error trying to searching the product',
            code: EErrors.PRODUCT_NOT_FOUND
         })
      }
      const productIndexInCart = products.findIndex(product => 
         product._id.toString() === productId.toString()
      );
      console.log(productIndexInCart)

      if (productIndexInCart !== -1) {
         products[productIndexInCart].quantity++;
      } else {
         products.push({ _id: productId, quantity: 1 });
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
      if (!products) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Product not found',
            message: 'Error trying to searching the product',
            code: EErrors.PRODUCT_NOT_FOUND
         })
      }
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
      if (!products) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Product not found',
            message: 'Error trying to searching the product',
            code: EErrors.PRODUCT_NOT_FOUND
         })
      }
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
   const products = await Promise.all(cart.products.map(async (productItem) => {
      const product = await productRepository.getProductById(productItem._id);
      return {
          _id: product._id,
          title: product.title,
          price: product.price,
          quantity: productItem.quantity
      };
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
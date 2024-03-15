import Carts from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/cart.repository.js";
import Products from '../dao/dbManagers/product.manager.js'
import ProductRepository from "../repositories/product.reposity.js"
import Ticket from '../dao/dbManagers/models/ticket.model.js';

const productDao = new Products();
const cartDao = new Carts();
const productRepository = new ProductRepository(productDao);
const cartRepository = new CartRepository(cartDao);

const processPurchase = async (cartId, user) => {
   const ProductosNoDisponibles = [];
   const ProductosDisponibles = [];
   const cart = await cartRepository.getCartById(cartId);

   for (const cartProduct of cart.products) {
      const productId = cartProduct._id;
      const productInfo = await productRepository.getProductById(productId);
      console.log(productId)

      if (productInfo && productInfo.stock >= cartProduct.quantity) {
         await productRepository.updateProduct(productId, {
         stock: productInfo.stock - cartProduct.quantity,
      });

      const productToAdd = {
         ...cartProduct.toObject(),
         price: productInfo.price,
      };

         ProductosDisponibles.push(productToAdd);
      } else {
         ProductosNoDisponibles.push(productId);
      }
   }
   const generateTicketCode = () => Date.now() + Math.floor(Math.random() * 100000 + 1);

   const calculateTotalAmount = (products) => {
      return products.reduce((total, product) => {
         const price = product.price || 0;
         const quantity = Number(product.quantity) || 0;
         const productAmount = price * quantity;
         return total + productAmount;
      }, 0);
   };
   const updatedProducts = cart.products.filter(
      (product) => ProductosDisponibles.some((pd) => pd._id === product._id)
   );


   if (ProductosDisponibles.length > 0) {
      await cartRepository.updateCart(cart._id, updatedProducts);
   }
   const totalAmount = calculateTotalAmount(ProductosDisponibles);
   
   if (ProductosDisponibles.length > 0) {
      const ticketData = {
         code: generateTicketCode(),
         amount: totalAmount,
         purchaser: user.email,
      };

   const ticket = await Ticket.create(ticketData);

   return { ticket };
};
}

export { processPurchase };
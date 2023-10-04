import { Router } from "express";
import CartManager from "../managers/cart.manager.js";

const router = Router();
const cartManager = new CartManager('./carrito.json');

router.post('/', async (req, res) => {
   const cart = await cartManager.addCart()
   if (!cart) {
      return res.status(400).send({ status: 'error', error: 'No se pudo agregar el carrito' });
   }
   res.send({ status: 'success', payload: cart });
});



router.get('/:cid', async (req, res) => {
   const id = Number(req.params.cid);
   const cart = await cartManager.getCartById(id)
   if (cart) {
      res.send(cart)
   }
   else{
      return res.status(404).send({ status: 'error', error: 'carrito no encontrado' });
   }
})


router.post('/:cid/product/:pid', async (req, res) => {
   const carts = await cartManager.getAllCarts();
   const cartId = Number(req.params.cid)
   const productId = Number(req.params.pid)

   const cartById = carts.find(cart => cart.id === cartId);

   const indexProductInCart = cartById.products.findIndex(product => product.id === productId);
   if (indexProductInCart != -1) {
      cartById.products[indexProductInCart].quantity++;
   } else {
      cartById.products.push({ id: productId, quantity: 1 });   
   }

   await cartManager.saveCart(carts);

})


export default router
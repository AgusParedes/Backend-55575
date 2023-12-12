import Router from "express";
// import CartManager from "../managers/cart.manager.js";
import { CreateCart, AddProductToCart, DeleteProductToCart, EditCart, EditProductQuantity, GetCartById, DeleteCart } from "../controllers/cart.controllers.js";

const router = Router();

router.post ('/', CreateCart )
router.post('/:cid/product/:pid', AddProductToCart);
router.delete('/:cid/products/:pid', DeleteProductToCart);
router.put('/:cid', EditCart);
router.put('/:cid/products/:pid', EditProductQuantity);
router.get('/cart/:cid', GetCartById);
router.delete('/:cid', DeleteCart);

export default router;
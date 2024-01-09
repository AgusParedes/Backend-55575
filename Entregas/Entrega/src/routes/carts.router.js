import Router from "express";
// import CartManager from "../managers/cart.manager.js";
import { CreateCart, AddProductToCart, DeleteProductToCart, EditCart, EditProductQuantity, GetCartById, DeleteCart } from "../controllers/cart.controllers.js";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../utils.js";
import { processPurchase } from "../controllers/ticket.controllers.js";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.post ('/', CreateCart )
router.post('/:cid/product/:pid', passportCall('jwt'),authorization('user'), AddProductToCart);
router.delete('/:cid/products/:pid', DeleteProductToCart);
router.put('/:cid', EditCart);
router.put('/:cid/products/:pid', EditProductQuantity);
router.get('/cart/:cid', GetCartById);
router.delete('/:cid', DeleteCart);
router.post('/:cid/purchase', passportCall('jwt'),authorization('user'), processPurchase);

export default router;
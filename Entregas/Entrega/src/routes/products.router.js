import Router from "express";
// import ProductManager from '../managers/product.manager.js'
import { RenderHome, GetInfoPages, RenderProductsWithQuerys, GetById, NewProduct, EditProduct, DeleteProduct } from "../controllers/products.constrollers.js";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../utils.js";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.get('/home', RenderHome);
router.get('/', GetInfoPages);
router.get('/products', RenderProductsWithQuerys);
router.get('/:pid', GetById);
router.post('/', passportCall('jwt'),authorization('premium', 'admin'), NewProduct);
router.put('/:pid', passportCall('jwt'),authorization('admin'), EditProduct);
router.delete('/:pid', passportCall('jwt'),authorization('premium', 'admin'), DeleteProduct);

export default router;
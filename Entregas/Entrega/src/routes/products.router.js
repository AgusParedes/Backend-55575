import Router from "express";
// import ProductManager from '../managers/product.manager.js'
import { RenderHome, GetInfoPages, RenderProductsWithQuerys, GetById, NewProduct, EditProduct, DeleteProduct } from "../controllers/products.constrollers.js";
import { passportCall } from "../config/passport.config.js";
import { authorization } from "../utils.js";

const router = Router();

router.get('/home', RenderHome);
router.get('/', GetInfoPages);
router.get('/products', RenderProductsWithQuerys);
router.get('/:pid', GetById);
router.post('/', passportCall('jwt'),authorization('admin'), NewProduct);
router.put('/:pid', passportCall('jwt'),authorization('admin'), EditProduct);
router.delete('/', passportCall('jwt'),authorization('admin'), DeleteProduct);

export default router;
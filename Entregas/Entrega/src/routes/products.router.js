import Router from "express";
// import ProductManager from '../managers/product.manager.js'
import { RenderHome, GetInfoPages, RenderProductsWithQuerys, GetById, NewProduct, EditProduct, DeleteProduct } from "../controllers/products.constrollers.js";

const router = Router();

router.get('/home', RenderHome);
router.get('/', GetInfoPages);
router.get('/products', RenderProductsWithQuerys);
router.get('/:pid', GetById);
router.post('/', NewProduct);
router.put('/:pid', EditProduct);
router.delete('/', DeleteProduct);

export default router;
import { Router } from "express"
import ProductManager from '../managers/product.manager.js'



const router = Router();
const productManager = new ProductManager('./productos.json');

router.get('/', async (req, res) => {
   const productos = await productManager.getProducts();
   res.render('home', { productos: productos });
})

   export default router
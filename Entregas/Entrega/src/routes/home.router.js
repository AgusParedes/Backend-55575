import { Router } from "express"
// import ProductManager from '../managers/product.manager.js'
import Products from '../dao/dbManagers/product.manager.js'



const router = Router();
const productManager = new Products;

router.get('/', async (req, res) => {
   const productos = await productManager.getAll();
   res.render('home', { productos: productos });
})

   export default router
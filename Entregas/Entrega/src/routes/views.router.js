import { Router } from "express"
import ProductManager from '../managers/product.manager.js'

const viewsRouter = (io) => {
   const router = Router();
   const productManager = new ProductManager('./productos.json');

router.get('/', async (req, res) =>{
   res.render('realTimeProducts');
})

router.post('/', async (req, res) => {
   const  { title, description, code, price, status = true, stock, category, thumbnail } = req.body;
   const product = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);

   if (product) {
      io.emit("productAdded", product);
      res.send({ status: 'success', payload: product });
   } else {
      res.status(400).send({ status: 'error', error: 'No se pudo agregar el producto' });
   }
})

router.delete('/:pid', async (req, res) => {
   const productId = Number(req.params.pid);
   const deletedProduct = await productManager.deleteProduct(productId);

   if (deletedProduct) {
      io.emit("productDeleted", productId);
      res.send({ status: 'success', payload: deletedProduct });
   } else {
      res.status(400).send({ status: 'error', error: 'No se pudo eliminar el producto' });
   }
})

return router
}

export default viewsRouter;
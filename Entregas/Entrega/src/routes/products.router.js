import { Router } from "express"
import ProductManager from '../managers/product.manager.js'

const router = Router();
const productManager = new ProductManager('./productos.json');

router.get('/', async (req, res) => {
   res.render('home');
   })


router.get('/:pid', async (req, res) => {
   const id = Number(req.params.pid);
   const product = await productManager.getProductById(id);
   if (product) {
      res.send(product)
   }
   else{
      return res.status(404).send({ status: 'error', error: 'producto no encontrado' });
   }
})


router.post('/', async (req, res) => {
   const { title, description, code, price, status = true, stock, category, thumbnail } = req.body;
   const product = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);

   if (!product) {
      return res.status(400).send({ status: 'error', error: 'No se pudo agregar el producto.' });
   }

   res.send({ status: 'success', payload: product });
});



router.put('/:pid', async (req, res) => {
   const productId = Number(req.params.pid);
   const updatedFields = req.body;
   const updatedProduct = await productManager.updateProduct(productId, updatedFields);

   if (updatedProduct) {
      res.send({ status: 'success', payload: `producto actualizado`});
   } else {
      res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
   }
})


router.delete('/:pid', async (req, res) => {
   const productId = Number(req.params.pid);
   const deletedProduct = await productManager.deleteProduct(productId);

   if (!deletedProduct) {
      return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
   }
   res.send({ status: 'success', payload: `producto eliminado`});
})

export default router
import express from 'express';
import ProductManager from './ProductManager.js'

const app = express();
const productManager = new ProductManager('./files/Productos.json');

app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
   const limit = req.query.limit;
   const products = await productManager.getProducts();

   if (limit && isNaN(limit)) {
      res.send('ERROR: Debe ingresar un numero para el limite');
   } else {
      if (limit) {
         const productosLimitFilter = products.slice(0, limit);
         res.send(productosLimitFilter);
      } else {
         res.send(products);
      }
   }
   }
)

app.get('/products/:pid', async (req, res) => {
   const id = Number(req.params.pid);
   const product = await productManager.getProductById(id);
   if (product) {
      res.send(product)
   }
   else{
      res.send('ERROR:Producto no encotrado')
   }
})

app.listen(8080,()=>console.log("Listening on 8080"))
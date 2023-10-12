import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import ProductManager from './managers/product.manager.js';
import Home from './routes/home.router.js'

const app = express();

app.use(express.json());

app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

const server = app.listen(8080,()=>console.log("Listening on 8080"))
const io = new Server(server)


app.use('/realtimeproducts', viewsRouter(io));
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/', Home); 





const productManager = new ProductManager('./productos.json');
io.on('connection', async (socket) => {
   console.log('Un usuario se ha conectado');

   try {
      const products = await productManager.getProducts();
      io.emit("showProducts", products);
   } catch (error) {
      console.error(error);
   }

   socket.on('addProduct', async (productData) => {
      const product = await productManager.addProduct(productData.title, productData.description, productData.code, productData.price, productData.stock, productData.category, productData.thumbnail);
      if (product) {
         io.emit("productAdded", product);
      } else {
         console.log('No se pudo agregar el producto')
      }
   });
   socket.on('deleteProduct', async (productId) => {

      const deletedProduct = await productManager.deleteProduct(Number(productId));
      if (deletedProduct) {
         io.emit("productDeleted", productId);
      } else {
         console.log('No se pudo borrar el producto')
      }
   });

   socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
   });
});

app.set('socketio', io);
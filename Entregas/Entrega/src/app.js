import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import ProductManager from './managers/product.manager.js';

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





const productManager = new ProductManager('./productos.json');
io.on('connection', async (socket) => {
   console.log('Un usuario se ha conectado');

   try {
      const products = await productManager.getProducts();
      io.emit("showProducts", products);
   } catch (error) {
      console.error(error);
   }

   socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
   });
});

app.set('socketio', io);
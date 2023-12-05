import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import realTimeProducts from './routes/realTimerProduct.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import Products from './dao/dbManagers/product.manager.js';
import mongoose from 'mongoose';
import Home from './routes/home.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import ViewsRouter from './routes/views.router.js';
import SessionsRouter from './routes/sessions.router.js';
import { initializePassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';

const app = express();

const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();




app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

try {
   await mongoose.connect('mongodb+srv://paredesagustin15:Agus2203@ecommerce.ttsanlh.mongodb.net/ecommerce?retryWrites=true&w=majority');
   console.log('DB connected');
} catch (error) {
   console.log(error.message);
}

app.use(session({
   store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600
   }),
   secret: 'Coder5575Secret',
   resave: true,
   saveUninitialized: true, 
}));


initializePassport();

app.use(passport.initialize());
app.use(passport.session());

// app.use('/realtimeproducts', realTimeProducts(io));
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
// app.use('/', Home); 
app.use('/', ViewsRouter);
app.use('/api/sessions', SessionsRouter);




const server = app.listen(8080,()=>console.log("Listening on 8080"))
const io = new Server(server)

const productManager = new Products;
io.on('connection', async (socket) => {
   console.log('Un usuario se ha conectado');

   try {
      const products = await productManager.getAll();
      io.emit("showProducts", products);
   } catch (error) {
      console.error(error);
   }

   socket.on('addProduct', async (productData) => {
      const product = await productManager.save(productData);
      if (product) {
         io.emit("productAdded", product);
      } else {
         console.log('No se pudo agregar el producto', product)
      }
   });
   socket.on('deleteProduct', async (productId) => {
      try {
         const deletedProduct = await productManager.delete(productId);
         if (deletedProduct) {
            io.emit("productDeleted", productId);
         }
      } catch (error) {
         console.log('No se pudo borrar el producto', error)
      }
   });

   socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
   });
});

app.set('socketio', io);
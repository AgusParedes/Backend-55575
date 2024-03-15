import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname, __mainDirname } from './utils.js';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js';
import Products from './dao/dbManagers/product.manager.js';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import loggerRouter from './routes/logger.router.js';
import { initializePassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import configs from "./config/config.js";
import currentRouter from "./routes/current.router.js";
import errorHandler from './Errors/index.js';
import { addLogger } from './utils.js';
import { cpus } from 'os'
import viewsresetPassword from './routes/viewsresetPassword.router.js'
import resetPasswordRouter from './routes/resetPassword.router.js'
import userRouter from './routes/user.router.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
try {
   await mongoose.connect(configs.mongoUrl);
   console.log('DB connected');
   app.use(session({
      store: MongoStore.create({
         client: mongoose.connection.getClient(),
         ttl: 3600
      }),
      secret: configs.sessionSecret,
      resave: true,
      saveUninitialized: true, 
   }));
} catch (error) {
   console.log(error.message);
}

const numeroNucleos = cpus().length;
console.log(numeroNucleos);

initializePassport();

const swaggerOptions = {
   definition: {
      openapi: '3.0.1',
      info: {
         title: 'Documentación del proyecto de venta de productos',
         description: 'API pensada en resolver el proceso de compra de productos.'
      }
   },
   apis: [`${__mainDirname}/Docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);

// app.use('/realtimeproducts', realTimeProducts(io));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// app.use('/', Home); 
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/current', currentRouter);
app.use('/loggerTest', loggerRouter)
app.use('/api/reset-password', viewsresetPassword)
app.use('/api/logic-reset', resetPasswordRouter)
app.use('/api/users', userRouter)
app.use(errorHandler);


const server = app.listen(configs.port,()=>console.log("Listening on 8080"))
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
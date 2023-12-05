import Router from "./router.js";
// import CartManager from "../managers/cart.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js"
import { cartsModel } from '../dao/dbManagers/models/carts.model.js'
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';


export default class CartsRouter extends Router {
   constructor() {
      super();
      this.cartManager = new Carts();
   }

   init() {
      this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.CreateCart);
      this.post('/:cid/product/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.AddProductToCart);
      this.delete('/:cid/products/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.DeleteProductToCart);
      this.put('/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.EditCart);
      this.put('/:cid/products/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.EditProduct);
      this.get('/cart/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.GetCartById);
      this.delete('/:cid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.DeleteCart);
   }   
   
   
   async CreateCart (req, res) {
   try {
      const result = await this.cartManager.create({
         products: [] 
      });
      res.sendSuccessNewResourse(result);
   } catch (error) {
      res.sendServerError (error.message);
   }
};


async AddProductToCart (req, res) {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid; 

      const cart = await this.cartManager.getById(cartId);

      if (!cart) {
         return res.sendServerError('Carrito no encontrado');
      }

      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId; 
      });

      if (indexProductInCart != -1) {
         products[indexProductInCart].quantity++;
      } else {
         products.push({ product: productId, quantity: 1 });
      }

      await this.cartManager.update(cartId, products);

      res.sendSuccessNewResourse (cart);
   } catch (error) {
      res.sendServerError (error.message);
   }
};


async DeleteProductToCart (req, res) {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cart = await this.cartManager.getById(cartId);

      if (!cart) {
         return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
      }

      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId;
      });

      if (indexProductInCart !== -1) {
         products.splice(indexProductInCart, 1);
      }

      await this.cartManager.update(cartId, products);

      res.sendSuccess(cart);
   } catch (error) {
      res.sendServerError (error.message);
   }
};


async EditCart (req, res) {
   try {
      const cartId = req.params.cid;
      const newProducts = req.body;

      await this.cartManager.update(cartId, newProducts);

      res.sendSuccess('Carrito actualizado');
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
};


async EditProduct (req, res) {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      const cart = await this.cartManager.getById(cartId);

      if (!cart) {
         return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
      }

      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId;
      });

      if (indexProductInCart !== -1) {
         products[indexProductInCart].quantity = newQuantity;
      }

      await this.cartManager.update(cartId,  products );

      res.sendSuccess('Cantidad de producto actualizada');
   } catch (error) {
      res.sendServerError (error.message);
   }
};


async GetCartById (req, res) {
   try {
      const cartId = req.params.cid;
      const cart = await cartsModel.findById(cartId).populate("products.product");
      console.log(cart)
      const products = cart.products.map(products => ({
         product: products.product._id, 
         quantity: products.quantity,
         title : products.product.title, 
         description : products.product.description,
         code : products.product.code,
         price : products.product.price,
         status : products.product.status,
         stock : products.product.stock,
         category : products.product.category,
         thumbnail : products.product.thumbnail
      }));
      console.log(products)
      res.render('cart', { cartId, products });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
};


async DeleteCart (req, res) {
   try {
      const cartId = req.params.cid;

      await this.cartManager.delete(cartId);

      res.sendSuccess('Carrito eliminado');
   } catch (error) {
      res.sendServerError (error.message);
   }
};
};






















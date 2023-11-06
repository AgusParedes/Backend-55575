import { Router } from "express";
// import CartManager from "../managers/cart.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js"
import { cartsModel } from '../dao/dbManagers/models/carts.model.js'
import mongoose from 'mongoose';

const router = Router();
const cartManager = new Carts;

router.post('/', async (req, res) => {
   try {
      const result = await cartManager.create({
         products: [] 
      });
      res.status(201).send({ status: 'success', payload: result });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});



router.get('/:cid', async (req, res) => {
   try{
      const { cid } = req.params;
      const cart = await cartManager.getById(cid);
      res.send({ status: 'success', payload: cart });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
})


router.post('/:cid/product/:pid', async (req, res) => {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid; 

      const cart = await cartManager.getById(cartId);

      if (!cart) {
         return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
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

      await cartManager.update(cartId, products);

      res.send({ status: 'success', payload: cart });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});



router.delete('/:cid/products/:pid', async (req, res) => {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cart = await cartManager.getById(cartId);

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

      await cartManager.update(cartId, products);

      res.send({ status: 'success', payload: cart });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});



router.put('/:cid', async (req, res) => {
   try {
      const cartId = req.params.cid;
      const newProducts = req.body;

      await cartManager.update(cartId, newProducts);

      res.send({ status: 'success', message: 'Carrito actualizado' });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});


router.put('/:cid/products/:pid', async (req, res) => {
   try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;

      const cart = await cartManager.getById(cartId);

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

      await cartManager.update(cartId,  products );

      res.send({ status: 'success', message: 'Cantidad de producto actualizada' });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});


router.get('/cart/:cid', async (req, res) => {
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
});




router.delete('/:cid', async (req, res) => {
   try {
      const cartId = req.params.cid;

      await cartManager.delete(cartId);

      res.send({ status: 'success', message: 'Carrito eliminado' });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});



export default router
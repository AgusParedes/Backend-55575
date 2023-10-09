import { promises, existsSync } from 'fs';
import __dirname from '../utils.js';
import path from 'path';

export default class CartManager {

   constructor(relativePath){
      this.path = path.resolve(__dirname, relativePath);
      this.carts = [];
   }
   

   async saveCart(cart){
      await promises.writeFile(this.path, JSON.stringify(cart, null, '\t'));
   }

   async getCartById(cartId) {
      try {
         const carts = await this.getAllCarts();
         const cart = carts.find(cart => cart.id === cartId);
         if (cart) {
            return cart;
         } else {
            console.log("Not Found");
      }
      } catch (error) {
         console.log(error)
      }
   }

   async getAllCarts() {
      try{
         if(existsSync(this.path)){
            const data = await promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            this.carts = carts;
            return carts;
         }else{
            return [];
         }
      }
      catch (error){
         console.log(error);
      }
   }

   async addCart() {
      try {

         const carts = await this.getAllCarts();
   
         const cart = {
            products : []
         };
   
         if (carts.length === 0) {
            cart.id = 1;
         } else {
            cart.id = carts[carts.length - 1].id + 1;
         }
   
         carts.push(cart);
         await promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
         return cart;
   
      } catch (error) {
         console.log(error);
         return null;
      }
   }
}
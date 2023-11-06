import { promises, existsSync } from 'fs';
import __dirname from '../../utils.js';
import path from 'path';



export default class ProductManager {
   constructor(relativePath){
      this.path = path.resolve(__dirname, relativePath);
      this.products = [];
   }

   RevisionCode(code) {
      return this.products.every(product => product.code !== code);
   }

   getProducts = async () => {
      try{
         if(existsSync(this.path)){
            const data = await promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            this.products = products;
            return products;
         }else{
            return [];
         }
      }
      catch (error){
         console.log(error);
         return [];
      }
   }

   addProduct = async (title, description, code, price, stock, category, thumbnail = '',status = true ) => {
      try {

         price = parseFloat(price);
         stock = parseInt(stock);
         status = true;
         thumbnail = thumbnail ? thumbnail.split(',') : [];

   



         if (!title || !description || !code || !price || !status || !stock || !category) {
            console.log("Todos los campos son obligatorios. No se pudo agregar el producto.");
            return null;
         }
   
         const products = await this.getProducts();
   
         if (!this.RevisionCode(code)) {
            console.log("El código ya existe");
            return null;
         }
   
         const product = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
         };
   
         if (products.length === 0) {
            product.id = 1;
         } else {
            product.id = products[products.length - 1].id + 1;
         }
   
         products.push(product);
         await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
         return product;
   
      } catch (error) {
         console.log(error);
         return null;
      }
   }
   


getProductById = async (productId) => {
      try {
         const products = await this.getProducts();
         const product = products.find(product => product.id === productId);
         if (product) {
            return product;
         } else {
            console.log("Not Found");
      }
      } catch (error) {
         console.log(error)
      }
}

updateProduct = async (productId, updatedFields) => {
   try {
      const products = await this.getProducts();

      const productIndex = products.findIndex(product => product.id === productId);
      if(!updatedFields.id){
         if (productIndex !== -1) {
            const updatedProduct = { ...products[productIndex], ...updatedFields };
            products[productIndex] = updatedProduct;
   
            await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
   
            return updatedProduct;
         } else {
            console.log("Producto no encontrado");
         }
      }
      else{
         console.log("No se puede modificar el id")
      }

   } catch (error) {
      console.log(error);
   }
}

deleteProduct = async (productId) => {
   try {
      const products = await this.getProducts();

      const productIndex = products.findIndex(product => product.id === Number(productId));

      if (productIndex !== -1) {
         products.splice(productIndex, 1);
         await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
         console.log('Producto eliminado exitosamente.');
         return true;
      } else {
         console.log('Producto no encontrado.');
         return false;
      }
   } catch (error) {
      console.log(error);
      return false;
   }
}

}

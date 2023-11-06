import { productsModel } from '../dbManagers/models/product.model.js'


export default class Products {
   constructor() {
      console.log('Working products with DB');
   }

   getAll = async () => {
      const carts = await productsModel.find().lean();
      return carts;
   }

   save = async (product) => {
      
      try {
         const result = await productsModel.create(product);
         return result;
      } catch (error) {
         if (error.name === 'ValidationError') {
            console.log("Todos los campos son obligatorios. No se pudo agregar el producto.");
         } else if (error.code === 11000) {
            console.log("El código ya existe");
         } else {
            console.log(error);
         }
         return null;
      }
}


   getById = async (productId) => {
      const cart = await productsModel.find({ _id: productId });
      return cart;
   }

   update = async (id, course) => {
      const result = await productsModel.updateOne({ _id: id }, course);
      return result;
   }

   delete = async (productId) => {
      const result = await productsModel.deleteOne({ _id: productId });
      return result;
   }
}

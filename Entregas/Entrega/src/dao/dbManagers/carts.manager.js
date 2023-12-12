import { cartsModel } from '../dbManagers/models/carts.model.js'

export default class Carts {

   constructor() {
      console.log('Working carts with DB');
   }
   
   async getById(cartId) {
      const cart = await cartsModel.findById(cartId).populate("products");
      return cart;
   }
      
   
   async getAll() {
      const carts = await cartsModel.find().lean();
      return carts;
   }

   async create() {
         const cart = { products: [] };
         const result = await cartsModel.create(cart);
         return result;
   }

   async update(cartId, products) {
      const result = await cartsModel.updateOne({ _id: cartId }, { $set: { products: products } });
      return result;
}

   async delete(cartId) {
      const result = await cartsModel.deleteOne({ _id: cartId });
      return result;
   }

}
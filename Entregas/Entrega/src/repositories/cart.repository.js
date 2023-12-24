import CartDto from "../DTOs/cart.dto.js"

export default class CartRepository {
   constructor(dao) {
      this.dao = dao;
   }

   getCart = async() => {
      const result = await this.dao.getAll();
      return result;
   }

   createCart = async (cart) => {
      const cartToCreate = new CartDto(cart);
      const result = await this.dao.create(cartToCreate);
      return result;
   }

   getCartById = async (cartId) => { 
      const cart = await this.dao.getById(cartId);
      return cart;
   }

   updateCart = async(cartId, products)  => {
      const result = await this.dao.update(cartId, products);
      return result;
   }

   deleteCart = async(cartId) => { 
      const result = this.dao.delete(cartId)
      return result;
   }
}
import ProductDto from "../DTOs/product.dto.js"

export default class ProductRepository {
   constructor(dao) {
      this.dao = dao;
   }

   getAllProducts = async () => {
      const carts = await this.dao.getAll();
      return carts;
   }

   CreateProduct = async (product) => {
      const ProductToCreate = new ProductDto(product)
      const result = await this.dao.save(ProductToCreate);
      return result;
   }

   getProductById = async (productId) => {
      const cart = await this.dao.getById(productId);
      return cart;
   }

   updateProduct = async (id, updatedFields) => {
      const result = await this.dao.update(id, updatedFields);
      return result;
   }

   deleteProduct = async (productId) => {
      const result = await this.dao.delete(productId);
      return result;
   }

}
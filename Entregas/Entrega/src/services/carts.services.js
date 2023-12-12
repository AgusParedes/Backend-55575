import Carts from "../dao/dbManagers/carts.manager.js";

const cartManager = new Carts();

const CreateCart = async () => {
   const newCart = cartManager.create();
   return newCart
}

const AddProductToCart = async (CartId, productId) => {
   const cart = await cartManager.getById(CartId);
   if (cart) {
      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId; 
      });

      if (indexProductInCart != -1) {
         products[indexProductInCart].quantity++;
      } else {
         products.push({ product: productId, quantity: 1 });
      }
      await cartManager.update(CartId, products);
   }
   return cart
}

const DeleteProductToCart = async (CartId, productId) => {
   const cart = await cartManager.getById(CartId);
   if (cart) {
      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId;
      });

      if (indexProductInCart !== -1) {
         products.splice(indexProductInCart, 1);
      }
      await cartManager.update(CartId, products);
      return cart;
   }
}

const EditCart = async (cartId, newProducts) => {
   await cartManager.update(cartId, newProducts);
}

const EditProductQuantity = async (cartId, productId, newQuantity) => {
   const cart = await cartManager.getById(cartId);
   if (cart) {
      const products = cart.products;
      const indexProductInCart = products.findIndex(product => {
         return product.product.toString() === productId;
      });
      if (indexProductInCart !== -1) {
         products[indexProductInCart].quantity = newQuantity;
      }
      cartManager.update(cartId, products );
   }
}

const GetCartById = async (cartId) => {
   const cart = await cartManager.getById(cartId);
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
   return products
}

const DeleteCart = async (cartId) => {
   await cartManager.delete(cartId);
}
export {
   CreateCart,
   AddProductToCart,
   DeleteProductToCart,
   EditCart,
   EditProductQuantity,
   GetCartById,
   DeleteCart
}
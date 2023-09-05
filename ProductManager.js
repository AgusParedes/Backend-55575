class ProductManager {
   constructor(){
      this.products = [];
   }

   RevisionCode = (code) => {
      return this.products.every(product => product.code !== code);
   }

   addProduct = (title, description, price, thumbnail, code, stock,) => {
      if (title && description && price && thumbnail && code && stock) {
         if (this.RevisionCode(code)){
         const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
         };
         if (this.products.length === 0){
            product.id = 1;
         }
         else{
            product.id = this.products[this.products.length - 1].id + 1;
         }
         this.products.push(product);
         console.log("Producto agregado exitosamente.");
      }else{
         console.log("El code ya existe")
      }
   } else {
      console.log("Todos los campos son obligatorios. No se pudo agregar el producto.");
   }
   }
   getProducts = () => {
      return this.products;
   }
   getProductById = (productId) => {
      const product = this.products.find(product => product.id === productId);
      if (product) {
         return product;
      } else {
         console.log("Not Found");
      }
   }
   
}



const productManager = new ProductManager();
const getProducts = productManager.getProducts();

productManager.addProduct("Producto 1", "Descripción del producto 1", 19.99, "imagen.jpg", "ABC123", 50);
productManager.addProduct("Producto 2", "Descripción del producto 1", 19.99, "imagen.jpg", "ABC123", 50);

console.log(getProducts)
const ProductById = productManager.getProductById(5)
   if(ProductById){
      console.log("Se encotraron coincidencias de la busqueda:",ProductById)
};
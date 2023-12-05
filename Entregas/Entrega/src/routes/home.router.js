import Router from "./router.js";
// import ProductManager from '../managers/product.manager.js'
import Products from '../dao/dbManagers/product.manager.js'


export default class CartsRouter extends Router {
   constructor() {
      super();
      this.productManager = new Products();
   }

   init() {
      this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.RenderProducts);
   }   
   
async RenderProducts (req, res) {
   const productos = await this.productManager.getAll();
   res.render('home', { productos: productos });
}

};

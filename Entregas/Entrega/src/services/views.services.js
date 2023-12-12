import { productsModel } from '../dao/dbManagers/models/product.model.js'


const RenderHome = async (limit, page, query, sort, user) => {

      const result = await productsModel.paginate(query, { limit, page, sort });
      const cartId = user.cart;
      const products = result.docs.map(doc => doc.toObject());

      return { products, cartId, result }
   }

export{
   RenderHome
}
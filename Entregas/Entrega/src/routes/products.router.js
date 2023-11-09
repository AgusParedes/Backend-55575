import { Router } from "express"
// import ProductManager from '../managers/product.manager.js'
import Products from '../dao/dbManagers/product.manager.js'
import { productsModel } from '../dao/dbManagers/models/product.model.js'


const router = Router();
const productManager = new Products;

router.get('/home', async (req, res) => {
   res.render('home');
   })

router.get('/', async (req, res) => {
   try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const query = req.query.query ? JSON.parse(req.query.query) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};

      const result = await productsModel.paginate( query, { limit: limit, page: page, sort: sort});
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < result.totalPages ? page + 1 : null;
      const prevLink = prevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}&query=${JSON.stringify(query)}&sort=${JSON.stringify(sort)}` : null;
      const nextLink = nextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}&query=${JSON.stringify(query)}&sort=${JSON.stringify(sort)}` : null;

      const response = {
         status: 'success',
         payload: result.docs,
         totalPages: result.totalPages,
         prevPage: prevPage,
         nextPage: nextPage,
         page: result.page,
         hasPrevPage: result.hasPrevPage,
         hasNextPage: result.hasNextPage,
         prevLink: prevLink,
         nextLink: nextLink
      };
      res.send({ status: 'success', payload: response });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
})


router.get('/products', async (req, res) => {
   try {
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const query = req.query.query
      const sort = req.query.sort

      const result = await productsModel.paginate(query, { limit: limit, page: page, sort: sort });
      const cartId = "6544ff9dc4c37454e83065e8";
      const products = result.docs.map(doc => doc.toObject());
      console.log(products);
      res.render('products', { products, cartId, total: result.total, limit, page });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});





router.get('/:pid', async (req, res) => {
   try{
      const { pid } = req.params;
      const product = await productManager.getById(pid);
      res.send({ status: 'success', payload: product });
   }
   catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
})


router.post('/', async (req, res) => {
   try {
      const { title, description, code, price, status = true, stock, category, thumbnail } = req.body;

      if(!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
         return res.status(400).send({ status: 'error', message: 'incomplete values' });
      }

      const result = await productManager.save({
         title, 
         description, 
         code, 
         price, 
         status : true, 
         stock, 
         category, 
         thumbnail
      });
      res.status(201).send({ status: 'success', payload: result });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});



router.put('/:pid', async (req, res) => {
   try {
      const { pid } = req.params;
      const updatedFields = req.body;
      const updatedProduct = await productManager.update(pid, updatedFields);
      res.send({ status: 'success', payload: updatedProduct });
   } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
   }
});


router.delete('/:pid', async (req, res) => {
   try {
      const { pid } = req.params;
      const result = await productManager.delete(pid);
      res.send({ status: 'success', payload: result });
   } catch (error) {
      res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
   }
})

export default router
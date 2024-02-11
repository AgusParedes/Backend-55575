import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Purbeas de integración módulo de carritos', () => {
   it('POST de /api/carts debe crear un carrito correctamente', async () => {
      const { statusCode, _body } = await requester.post('/api/carts');
      expect(statusCode).to.be.eql(200);
      expect(_body.payload).to.have.property('_id');
   })
   it('POST de /api/carts se debe corroborar que el carrito creado tenga la propiedad products:[]', async () => {
      const { statusCode, _body } = await requester.post('/api/carts');
      expect(statusCode).to.be.eql(200);
      expect(_body.payload).to.have.property('products');
      expect(Array.isArray(_body.payload.products)).to.be.eql(true);
   })
   it('DELETE de /api/carts se debe corroborar que el carrito se elimine correctamente', async () => {
      const { _body } = await requester.post('/api/carts');
      const id = _body.payload._id;
      const deleteResult = await requester.delete(`/api/carts/${id}`);
      const deletedCartSearch = await requester.get(`/api/carts/${id}`);

      expect(deleteResult.statusCode).to.be.eql(200);
      expect(deletedCartSearch.statusCode).to.be.eql(404);
   })
})

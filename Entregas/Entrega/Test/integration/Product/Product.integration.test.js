import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración módulo de productos', () => {
   let token;

   before(async () => {
      const credentials = { email: '777@gmail.com', password: '1234' };
      const response = await requester.post('/api/sessions/login').send(credentials);
      token = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
   });

   it('POST de /api/products debe crear el producto correctamente', async () => {
      const ProductMock = {
         title: "Zapatillas Test",
         description: "Zapatillas adidas Test",
         code: "12345A",
         price: 1200,
         stock: 10,
         category: "Indumentaria"
      };
      const { statusCode, _body } = await requester
         .post('/api/products')
         .set('Cookie', `coderCookie=${token}`)
         .send(ProductMock);

      expect(statusCode).to.be.eql(201);
      expect(_body.payload).to.have.property('_id');
   })
      it('DELETE de /api/products se debe corroborar que el producto se elimine correctamente', async () => {
         const ProductMock = {
            title: "Moto Test",
            description: "Moto Test",
            code: "12345AB",
            price: 1200,
            stock: 10,
            category: "Vehiculos"
         };
         const { _body } = await requester
            .post('/api/products')
            .set('Cookie', `coderCookie=${token}`)
            .send(ProductMock);

      const id = _body.payload._id;
      const deleteResult = await requester
            .delete(`/api/products/${id}`)
            .set('Cookie', `coderCookie=${token}`);
      const deletedProductSearch = await requester.get(`/api/products/${id}`);

      expect(deleteResult.statusCode).to.be.eql(200);
      expect(deletedProductSearch.statusCode).to.be.eql(404);
   })
   it('POST de /api/products debe devolver error 401 si no tiene el token de jwt', async () => {
      const ProductMock = {
         title: "Zapatillas Test",
         description: "Zapatillas adidas Test",
         code: "12345A",
         price: 1200,
         stock: 10,
         category: "Indumentaria"
      };
      const { statusCode } = await requester.post('/api/products').send(ProductMock);

      expect(statusCode).to.be.eql(401);
   })
   
})


import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración módulo de productos', () => {
   let token;

   before(async () => {
      const credentials = { email: '777@gmail.com', password: '1234' };
      const response = await requester.post('/api/sessions/login').send(credentials);
      token = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
      
      console.log(token);
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
         .set('Authorization', `Bearer ${token}`)
         .send(ProductMock);

      expect(statusCode).to.be.eql(200);
      expect(_body.payload).to.have.property('_id');
   })
   
})


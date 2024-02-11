import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testing del módulo de sessions', () => {
   let cookie;

   it('Debemos registrar un usuario correctamente', async () => {
      const userMock = {
         first_name: 'Usuario',
         last_name: 'Prueba',
         email: 'UP@gmail.com',
         age:20,
         password: '1234'
      };

      const { statusCode } = await requester.post('/api/sessions/register').send(userMock);
      expect(statusCode).to.be.eql(201);
   });

   it('Debe devolver un error 400 al intentar registrar un usuario con falta de datos', async () => {
      const userMock = {
         first_name: 'Usuario',
         last_name: 'Prueba',
         password: '1234'
      };

      const { statusCode } = await requester.post('/api/sessions/register').send(userMock);
      expect(statusCode).to.be.eql(400);
   });

   it('Debemos loguear al usuario y retornar una cookie', async () => {
      const credentialsMock = {
         email: 'UP@gmail.com',
         password: '1234'
      };

      const loginResult = await requester.post('/api/sessions/login').send(credentialsMock);
      const cookieResult = loginResult.headers['set-cookie'][0];
         expect(cookieResult).to.be.ok;
         const cookieResultSplit = cookieResult.split('=');

      cookie = {
         name: cookieResultSplit[0],
         value: cookieResultSplit[1]
      }

      expect(cookie.name).to.be.ok.and.eql('coderCookie');
      expect(cookie.value).to.be.ok;
   });
   })
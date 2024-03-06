import Users from '../dao/dbManagers/users.manager.js';
import UserRepository from "../repositories/user.reposity.js"
import { cartsModel } from '../dao/dbManagers/models/carts.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';
import { usersModel } from '../dao/dbManagers/models/user.model.js';
import { fakerES as faker } from '@faker-js/faker';
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';
import bcrypt from 'bcrypt';


const userDao = new Users();
const userRepository = new UserRepository(userDao)

const Register = async (first_name, last_name, age, role, email, password,) => {
      const user = await userRepository.GetUserByEmail(email);
      console.log(user);
      if (!user) {
         const cart = await cartsModel.create({ products: [] });
         const userToSave = new usersModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id
         });

         await userToSave.save();

         console.log(userToSave);
         console.log(cart);

         return userToSave; 
      }

      
   }

const Login = async (email, password) => {
      const user = await userRepository.GetUserByEmail(email);
      if(!user){
         throw CustomError.createError({
            name: 'UserError',
            cause: 'User not found',
            message: 'Error trying to searching the User',
            code: EErrors.USER_NOT_FOUND
         })
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Incorrect password',
            message: 'Error trying to login, incorrect password',
            code: EErrors.INVALID_TYPE_ERROR
         });
      }
      if (user || isValidPassword(password, user.password)) {
         const { password: _, ...userResult } = user;
         const accessToken = generateToken(userResult);
         return accessToken;
      }
   }

const generateUsers = () => {
   return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(['user', 'admin']),
      cart: faker.database.mongodbObjectId(),
      age: faker.number.int({ min: 10, max: 100 }),
      id: faker.database.mongodbObjectId()
   }
}

export {
   Register,
   Login,
   generateUsers
}
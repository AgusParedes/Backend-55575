import Users from '../dao/dbManagers/users.manager.js';
import { cartsModel } from '../dao/dbManagers/models/carts.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';
import { usersModel } from '../dao/dbManagers/models/user.model.js';


const userManager = new Users();

const Register = async (first_name, last_name, age, role, email, password) => {
      const user = await userManager.getByEmail(email);
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
      const user = await userManager.getByEmail(email);
      if (user || isValidPassword(password, user.password)) {
         const { password: _, ...userResult } = user;
         const accessToken = generateToken(userResult);
         return accessToken;
      }
   }

export {
   Register,
   Login
}
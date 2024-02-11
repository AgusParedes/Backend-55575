import { Register as RegisterService,
         Login as LoginService,
         generateUsers as generateUsersService } from "../services/sessions.services.js";
import CustomError from '../Errors/CustomError.js';
import EErrors from '../Errors/enums.js';

const Register = async (req, res) => {
      const { first_name, last_name, age, role = "user", email, password } = req.body;

      if (!first_name || !last_name || !age || !role || !email || !password){
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Invalid data types, first_name, last_name and email required',
            message: 'Error trying to create user',
            code: EErrors.INVALID_TYPE_ERROR
         })
      }
      
      const userToSave = await RegisterService(first_name, last_name, age, role, email, password)

      res.status(201).send({ status: 'success', payload: userToSave });
}

const Login =  async (req, res) => {
      const { email, password } = req.body;
      if(!email || !password){
         throw CustomError.createError({
            name: 'UserError',
            cause: 'Invalid data types,email and password required',
            message: 'Error trying to loge in',
            code: EErrors.INVALID_TYPE_ERROR
         })
      }
      const accessToken = await LoginService(email, password)
      res.cookie('coderCookie', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })
}

const Logout = (req, res) => {
   req.session.destroy(error => {
      if(error) return res.status(500).send({ status: 'error', message: error.message });
      res.redirect('/login');
   })
}

const Github = async (req, res) => {
   res.send({ status: 'success', message: 'user registered' });
}

const Github_callback = async(req, res) => {
   req.session.user = req.user;
   res.redirect('/');
}

const MockUsers = async(req, res) => {
   let users = [];

   for(let i=0; i < 100; i++) {
      users.push(generateUsersService());
   }

   res.send({
      data: users
   });
}


export {
   Register,
   Login,
   Logout,
   Github,
   Github_callback,
   MockUsers
}
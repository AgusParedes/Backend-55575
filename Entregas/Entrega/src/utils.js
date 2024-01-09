import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from "./config/config.js";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createHash = password =>
   bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword =(plainPassword, hashedPassword) =>
   bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user) => {
   try {
      const token = jwt.sign({ user }, configs.privateKeyJwt , { expiresIn: '24h' });
      return token;
   } catch (error) {
      console.error('Error en generateToken:', error);
      throw error;
   }
   }


const authorization = (role) => {
   return async (req, res, next) => {
      if(req.user.role !== role) return res.status(403).send({ status: 'error', message: 'not permissions' })
      next();
   }
}


   export{
      __dirname,
      createHash,
      isValidPassword,
      generateToken,
      authorization
   } 

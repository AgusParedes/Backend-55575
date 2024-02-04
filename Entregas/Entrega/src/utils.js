import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from "./config/config.js";
import winston from 'winston';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __mainDirname = path.join(__dirname, '..');
console.log("este es el dirname",__dirname)
console.log("este es el maindarme",__mainDirname)
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
   };

const generateTokenResetPassword = (email) => {
   try {
      const token = jwt.sign({ email }, configs.privateKeyJwt , { expiresIn: '1h' });
      return token;
   } catch (error) {
      console.error('Error en generateToken:', error);
      throw error;
   }
   }

const authorization = (...roles) => {
   return async (req, res, next) => {
      if(!roles.includes(req.user.role)) return res.status(403).send({ status: 'error', message: 'not permissions' })
      next();
   }
}

const ENVIRONMENT = 'production';
let logger;

const customLevelOptions = {
   levels: {
      debug: 5, 
      http: 4, 
      info: 3, 
      warning: 2, 
      error: 1, 
      fatal: 0
   }}

if(ENVIRONMENT === 'production') {
      logger = winston.createLogger({
         levels: customLevelOptions.levels,
         transports: [
            new winston.transports.Console({
               level: 'info'
            }),
            new winston.transports.File({
               filename: 'logs/errors.log',
               level: 'error'
            })
         ]
   });
} else {
      logger = winston.createLogger({
         levels: customLevelOptions.levels,
         transports: [
            new winston.transports.Console({
               level: 'debug'
            })
         ]
   });
}


const addLogger = (req, res, next) => {
   req.logger = logger;
   next();
}


   export{
      __dirname,
      createHash,
      isValidPassword,
      generateToken,
      generateTokenResetPassword,
      authorization,
      addLogger,
      __mainDirname
   } 

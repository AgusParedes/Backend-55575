import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createHash = password =>
   bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword =(plainPassword, hashedPassword) =>
   bcrypt.compareSync(plainPassword, hashedPassword);

   export{
      __dirname,
      createHash,
      isValidPassword
   } 

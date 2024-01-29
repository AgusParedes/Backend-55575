import dotenv from 'dotenv';

dotenv.config();

const configs = {
   port: process.env.PORT,
   mongoUrl: process.env.MONGO_URL,
   privateKeyJwt:process.env.PRIVATE_KEY_JWT,
   sessionSecret:process.env.SESSION_SECRET,
   userNodemailer: process.env.USER_NODEMAILER,
   passwordNodemailer: process.env.PASSWORD_NODEMAILER
};

export default configs;
import { generateTokenResetPassword } from "../utils.js";
import { sendEmail } from "./mail.service.js";
import Users from '../dao/dbManagers/users.manager.js';
import UserRepository from "../repositories/user.reposity.js"
import { ResetPasswordHTML } from '../utils/custom.html.js'
const userDao = new Users();
const userRepository = new UserRepository(userDao)

const sendPasswordResetEmail = async (email) => {
   try {
      const user = await userRepository.getUserByEmail(email);
      if(user){
         const token = generateTokenResetPassword(email);
         const resetPasswordLink = `http://localhost:8080/api/reset-password/NewPassword?token=${token}`;   
         const emailInvalidCredentials = {
            to: user.email,
            subject: 'Restablecer Contraseña',
            html: ResetPasswordHTML.replace('{{resetPasswordLink}}', resetPasswordLink)
         };
         await sendEmail(emailInvalidCredentials);
         console.log('Correo electrónico de restablecimiento de contraseña enviado a:', user.email);
         return token
      }
   } catch (error) {
      console.error('Error al enviar el correo electrónico de recuperación:', error);
      throw error;
   }
};


export { sendPasswordResetEmail };
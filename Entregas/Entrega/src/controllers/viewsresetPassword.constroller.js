import jwt from 'jsonwebtoken';
import configs from '../config/config.js';

const View_SendEmail = async (req, res) => {
   res.render('sendEmailReset')
}

const View_SendPassword = async (req, res) => {
   const token = req.query.token;
   if (!token) {
      return res.status(400).send('Token de restablecimiento de contraseña no proporcionado');
   }
   try {
      const decodedToken = jwt.verify(token, configs.privateKeyJwt);
      res.render('sendPasswordReset');
   } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.render('sendEmailReset')
   }
}
export {
   View_SendEmail,
   View_SendPassword
}
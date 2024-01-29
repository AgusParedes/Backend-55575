import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
   service: 'gmail',
   port: 587,
   auth: {
            user: config.userNodemailer,
            pass: config.passwordNodemailer
   }
});

export const sendEmail = async (email) => {
   try {
      await transporter.sendMail({
         from: 'CoderHouse 55575',
         to: email.to,
         subject: email.subject,
         html: email.html
      });
      console.log('Correo electrónico enviado correctamente:', email.subject);
   } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
   }
}

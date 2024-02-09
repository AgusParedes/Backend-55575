import { sendPasswordResetEmail as sendPasswordResetEmailService} from "../services/resetPassword.service.js";

const resetPassword =  async (req, res) => {
   try {
      const { email } = req.body;
      console.log(email)
      await sendPasswordResetEmailService(email)
      res.status(200).send('Correo de restablecimiento de contraseña enviado correctamente');
   } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
   }
}

export{
   resetPassword
}
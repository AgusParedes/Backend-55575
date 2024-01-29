import { sendPasswordResetEmail as sendPasswordResetEmailService} from "../services/resetPassword.service.js";

const resetPassword =  async (req, res) => {
   try {
      const { email } = req.body;
      console.log(email)
      await sendPasswordResetEmailService(email)
   } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
   }
}

export{
   resetPassword
}
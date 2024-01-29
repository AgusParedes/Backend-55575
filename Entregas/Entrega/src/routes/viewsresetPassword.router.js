import Router from "express";
import {View_SendEmail, View_SendPassword } from '../controllers/viewsresetPassword.constroller.js'

const router = Router();

router.get ('/SendEmailReset', View_SendEmail) 
router.get ('/NewPassword', View_SendPassword)

export default router
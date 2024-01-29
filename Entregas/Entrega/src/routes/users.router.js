import Router from "express";
import {View_SendEmail, View_SendPassword } from '../controllers/viewsresetPassword.constroller.js'

const router = Router();

router.get ('/sendEmailReset', View_SendEmail) 
router.get ('/reset-password', View_SendPassword)

export default router
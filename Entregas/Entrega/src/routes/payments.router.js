import Router from "express";
import { CreatePaymentIntent } from "../controllers/payment.controller.js"

const router = Router();

router.get('/payment-intent', CreatePaymentIntent );

export default router;
import Router from "express";
import { CreatePaymentIntent, RenderPaymentIntent } from "../controllers/payment.controller.js"

const router = Router();

router.get('/payment-intent', RenderPaymentIntent );
router.post('/ProcesToPay', CreatePaymentIntent );

export default router;
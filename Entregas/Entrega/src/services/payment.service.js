import Stripe from "stripe";

export default class PaymentService {
   constructor() {
      this.stripe = new Stripe('sk_test_51OrJwQ2NtyGbEe00ca7YTLxPve0Kit4UdxJVhz2U8vb6BdaPNkFIqayBY4zQE767J5FnoaOEdHZ2t0L1ZvdIOpVG00M8hu7dlg');
   }

   createPaymentIntent = async (data) => {
      const paymentIntent = this.stripe.paymentIntents.create(data);
      return paymentIntent;
   }
}
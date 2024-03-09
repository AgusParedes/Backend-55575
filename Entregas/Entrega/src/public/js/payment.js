import { loadStripe } from '@stripe/stripe-js';

document.addEventListener('DOMContentLoaded', async function () {
    const stripe = await loadStripe('pk_test_51OrJwQ2NtyGbEe00JcRIDYRPbGgxoKh6mXEseo60GoVnCi6DZq5CBX47X2JdK5Hz4DbWRjjJ4MkanTtYXjlPZvaO00MoScNZDM');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const clientSecret = form.dataset.clientSecret;
        await confirmarPago(clientSecret);
    });

    async function confirmarPago(clientSecret) {
        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement
            }
        });
        if (error) {
            console.error('Error al confirmar el pago:', error.message);
        } else {
            console.log('Pago confirmado exitosamente');
        }
    }
});

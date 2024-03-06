export default class CartDto {
    constructor(cart) {
        this.products = cart.products.map(productEntry => ({
            productId: productEntry.product._id,
            quantity: productEntry.quantity || 1
        }));
    }
}
const db = require('./dbs');
async function updateTotalPrice(userId) {
    try {
        const userCart = await db('cart').where('id_user', userId).first();

        if (!userCart) {
            return { message: 'Cart not found' };
        }

        const cartItems = await db('cartItems')
            .where('id_cart', userCart.id)
            .join('product', 'cartItems.id_product', 'product.id')
            .select('product.price', 'cartItems.quantity');

        const totalPrice = cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        await db('cart').where('id', userCart.id).update('total', totalPrice);
        return { message: 'Total price updated successfully' };
    } catch (error) {
        return { error: 'Failed to update total price' };
    }

}
module.exports = { updateTotalPrice };
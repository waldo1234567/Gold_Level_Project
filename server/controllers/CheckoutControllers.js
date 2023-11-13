const db = require('./dbs');
const updatePrice = require('./updatePrice');

class CheckoutControllers {
    static async createCheckout(req, res) {
        const { userId, paymentId } = req.body;
        try {
            const trx = await db.transaction();
            const userCart = await db('cart').where('id_user', userId).first();
            if (!userCart) {
                return res.status(400).json({ message: 'cart not found!' });
            }
            const cartItems = await db('cartItems').where('id_cart', userCart.id).join('product', 'cartItems.id_product', 'product.id').select('product.id', 'product.product_name', 'product.price', 'cartItems.quantity','product.stock');
            const totalPrice = cartItems.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0);

            for (const item of cartItems) {
                if (item.quantity > item.stock) {
                    trx.rollback();
                    return res.status(400).json({ message: `Not enough stock available for ${item.product_name}` });
                }
            }

            const newCheckout = await trx('checkout').insert({
                id_user: userId,
                id_payment: paymentId,
                order_status: 'Pending',
                created_at: new Date(),
                total: totalPrice,
            }).returning('id');

            if (newCheckout.length === 0 || undefined || null) {
                trx.rollback();
                return res.status(500).json({ message: 'Failed to create a checkout' });
            }
            const checkoutId = newCheckout[0].id;

            for (const item of cartItems) {
                await trx('checkoutItems').insert({
                    checkout_id: checkoutId,
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                });
                await trx('product')
                .where('id', item.id)
                .decrement('stock', item.quantity);
            }

            await trx.commit();
            console.log('userId:', userId);
            console.log('paymentId:', paymentId);
            console.log('checkoutId:', checkoutId);

            await db('cartItems').where('id_cart', userCart.id).del();
            await db('cart').where('id',userCart.id ).update('total', 0);

            return res.status(201).json({ message: 'checkout successfull!' });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    static async updateOrderStatus(req, res) {
        const { idCheckout, newStatus } = req.body;
        try {
            await db('checkout').where('id', idCheckout).update({ order_status: newStatus });
            return res.status(201).json({ message: 'order successfully created !' });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    static async getCheckout(req,res){
        const {checkoutId} = req.body;
        try {
            const checkout = await db('checkout').where('id',checkoutId).first();
            if(!checkout){
                return res.status(400).json({message: 'no checkout found!'});
            }
            const items = await db('checkoutItems').where('checkout_id', checkoutId).join('product', 'checkoutItems.product_id','product.id').select('product.product_name','checkoutItems.quantity','checkoutItems.price');
            console.log(items);
            return res.status(200).json(items);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'failed to retrieve details!'});
        }
    }

}

module.exports = CheckoutControllers;
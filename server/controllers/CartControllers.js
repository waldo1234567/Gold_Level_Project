const knex = require('knex');
const db = require('./dbs');
const updatePrice = require('./updatePrice');

class CartControllers {
    static async addToCart(req, res) {
        const { idProduct, quantity } = req.body
        console.log(req.body);
        if (!req.session.user || !req.session.user.id) {
            return res.redirect('/user/login');
        }
        const userId = req.session.user.id;
        try {
            let userCart = await db('cart').where('id_user', userId).first();
            if (!userCart) {
                const newCart = await db('cart').insert({
                    id_user: userId,
                    total: 0
                });
                userCart = { id: newCart[0] };
            }
            const existingItem = await db('cartItems').where({ id_cart: userCart.id, id_product: idProduct }).first();
            console.log(existingItem);
            if (existingItem !== undefined) {
                await db('cartItems')
                    .where({ id_cart: userCart.id, id_product: idProduct })
                    .increment('quantity', quantity);
            } else {
                await db('cartItems').insert({
                    id_cart: userCart.id,
                    id_product: idProduct,
                    quantity
                });
                const insertedItem = await db('cartItems').where('id',userCart.id).first();
                console.log('Inserted Item:', insertedItem);
            }
            await updatePrice.updateTotalPrice(userId);
            return res.redirect('/products/showAllDataPage');
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }


    }

    static async addNewCart(req, res) {
        const { userId } = req.body
        const hasCart = false;
        try {
            const existingCart = await db('cart').where('id_user', userId).first();

            if (existingCart) {
                return res.status(400).json({ message: 'cart already existed!' })
            }

            const newCart = await db('cart').insert({
                'id_user': userId,
                'total': 0
            })

            return res.status(200).json({ message: 'new cart has been created', hasCart: true, cartId: newCart[0] });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }


    }

    static async updateCartData(req, res) {
        const { userId } = req.body
        try {
            const userCart = await db('cart').where('id_user', userId).first();
            if (!userCart) {
                return res.status(400).json({ message: 'cart not found!' });
            }
            const updatedTotal = updatePrice.updateTotalPrice(userId);

            return res.status(200).json({ updatedTotal });

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async decreaseQuantity(req, res) {
        const { cartId, productId, userInput } = req.body;

        try {
            const existingItem = await db('cartItems').where({ id_cart: cartId, id_product: productId }).first();

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    if (userInput > 0) {
                        await db('cartItems').where({ id_cart: cartId, id_product: productId }).decrement('quantity', userInput);

                        const updatedCart = await db('cartItems').where({ id_cart: cartId, id_product: productId }).first();
                        console.log('Updated Quantity:', updatedCart.quantity);
                        if (updatedCart.quantity <= 0) {
                            await db('cartItems').where({ id_cart: cartId, id_product: productId }).del();
                            return res.status(200).json({ message: 'product removed from cart!' });
                        }
                    }
                }
                console.log('Existing Quantity:', existingItem.quantity);

                return res.status(200).json({ message: 'Quantity decreased successfully' });
            } else {
                return res.status(400).json({ message: 'product not found in cart!' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    static async increaseQuantity(req, res) {
        const { cartId, productId, userQuantity } = req.body;
        try {
            const existingItem = await db('cartItems').where({ id_cart: cartId, id_product: productId }).first();
            const productInStock = await db('product').where('id', productId).first();
            console.log(productInStock.stock);
            if (existingItem) {
                const totalQuantity = existingItem.quantity + userQuantity;
                if (totalQuantity <= productInStock.stock) {
                    if (userQuantity > 0) {
                        await db('cartItems').where({ id_cart: cartId, id_product: productId }).increment('quantity', userQuantity);
                        const updatedCart = await db('cartItems').where({ id_cart: cartId, id_product: productId }).first();
                        console.log('Updated Quantity:', updatedCart.quantity);
                    }
                } else {
                    return res.status(400).json({ message: 'stock not enough!' });
                }
                return res.status(200).json({ message: 'Quantity increased successfully' });
            } else {
                return res.status(400).json({ message: 'product not found in cart!' });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'failed >:(' });
        }
    }

    static async deleteItemInCart(req, res) {
        const { cartId, productId } = req.body;
        try {
            const existingItem = await db('cartItems').where({ id_cart: cartId, id_product: productId }).first();
            if (existingItem) {
                const product = await db('product').where('id', productId).first();
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                await db('cartItems').where({ id_cart: cartId, id_product: productId }).del();
                const cartItems = await db('cartItems').where('id_cart', cartId).join('product', 'cartItems.id_product', 'product.id').select('product.price', 'cartItems.quantity');
                const totalPrice = cartItems.reduce((total, item) => {
                    return total + item.price * item.quantity;
                }, 0);
                await db('cart').where('id', cartId).update('total', totalPrice);

                return res.status(200).json({ message: 'successfully removed item!' });
            } else {
                return res.status(400).json({ message: 'cart has no items!' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    static async getCartData(req, res) {
        const { cartId } = req.body;

        try {
            const cartItems = await db('cartItems')
                .where('id_cart', cartId)
                .select('cartItems.quantity', 'product.id as productId', 'product.product_name', 'product.description', 'product.price')
                .join('product', 'cartItems.id_product', 'product.id');
            console.log(cartItems);
            // res.status(200).send('product', { currentCart: cartItems });
            return cartItems;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = CartControllers;
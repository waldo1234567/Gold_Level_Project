const routes = require('express').Router();
const CartControllers = require('../controllers/CartControllers');

routes.post('/createCart', CartControllers.addNewCart);
routes.post('/addItems', CartControllers.addToCart);
routes.get('/getCartData', CartControllers.updateCartData);
routes.patch('/decreaseQuantity', CartControllers.decreaseQuantity);
routes.delete('/deleteItems', CartControllers.deleteItemInCart);
routes.patch('/addQuantity', CartControllers.increaseQuantity);

module.exports = routes;
const routes = require('express').Router();
const  CheckoutControllers = require('../controllers/CheckoutControllers');

routes.post('/createCheckout', CheckoutControllers.createCheckout);
routes.patch('/updateOrder',CheckoutControllers.updateOrderStatus);
routes.get('/getDetails', CheckoutControllers.getCheckout);

module.exports = routes;
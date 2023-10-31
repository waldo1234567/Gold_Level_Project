const routes = require('express').Router()
const ProductControllers = require('../controllers/ProductControllers');

routes.get('/allProducts', ProductControllers.showAllProducts);
routes.post('/postProduct', ProductControllers.addNewProduct);
routes.patch('/updateProduct',ProductControllers.updateProduct);
routes.delete('/removeProduct/:idInput',ProductControllers.removeProduct);
routes.get('/getProductById/:idInput',ProductControllers.getProductById );

module.exports = routes;
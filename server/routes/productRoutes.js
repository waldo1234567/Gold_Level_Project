const routes = require('express').Router()
const ProductControllers = require('../controllers/ProductControllers');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer ({storage: storage});

routes.get('/allProducts', ProductControllers.showAllProducts);
routes.post('/postProduct',upload.single('product_image'), ProductControllers.addNewProduct);
routes.patch('/updateProduct',ProductControllers.updateProduct);
routes.delete('/removeProduct/:idInput',ProductControllers.removeProduct);
routes.get('/getProductById/:idInput',ProductControllers.getProductById );
routes.get('/showAllDataPage', ProductControllers.showProductPage);
routes.post('/sortByCategory', ProductControllers.sortByCategory);
routes.get('/showUploadProduct', ProductControllers.shwoAddProductPage);
routes.get('/showEditProduct', ProductControllers.showEditProduct);
routes.post('/updateProduct/:id',upload.single('image_url'),ProductControllers.updateProduct);
module.exports = routes;
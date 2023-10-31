const routes = require('express').Router()
const MerchantControllers = require('../controllers/MerchantControllers');

routes.get('/AllMerchantInfo', MerchantControllers.showAllMerchantInformation);
routes.post('/registerMerchant', MerchantControllers.registerMerchant);
routes.delete('/deleteMerchantUser/:idInput', MerchantControllers.deleteMerchantAccount);
routes.patch('/updateMerchantInfo', MerchantControllers.updateMerchantInfo);
routes.get('/getMerchantById/:idInput', MerchantControllers.searchMerchantById);
routes.post('/login',MerchantControllers.loginMerchant);

module.exports = routes;
const express = require('express');
const routes = express.Router();
const userRoutes = require('./userRoutes');
const merchantRoutes = require('./merchantRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');


routes.use('/user',userRoutes);
routes.use('/merchant', merchantRoutes);
routes.use('/products', productRoutes);
routes.use('/cart', cartRoutes);
routes.use('/checkout',checkoutRoutes);
routes.get('/home', (req,res)=>{
    res.render('index')
})


module.exports = routes;
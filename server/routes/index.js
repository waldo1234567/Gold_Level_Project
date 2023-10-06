const express = require('express');
const routes = express.Router();
const getDataMiddleware = require('./getDataMiddleware');
const UserControllers = require('../controllers/userControllers');

routes.get('/', (req ,res) => res.send('Halo Dunia!'));

routes.post('/upload-data', (req,res) => {
    let {nama,umur} = req.body;
    console.log(`atas nama ${nama} berumur ${umur} telah ditambahkan`)

    res.status(201).json({
        "message" : `akun bernama ${nama} dan berumur ${umur} telah ditambah`
    })
})

routes.get('/get-data', (req,res)=>{
    let data = {
        name : [
            'waldo','ini','itu'
        ],
        umur :[
            17,19,20,21
        ]
    }
    res.send(data);
})

routes.get("/regis-page", UserControllers.regis);

routes.post("/regis-page", UserControllers.getDataRegis);


routes.use('/get-the-datas', getDataMiddleware);

module.exports = routes;
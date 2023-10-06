const express = require('express');
const routes = express();



routes.get('/get-second-data',(req,res,next)=> {
    let data = {
        'nama' : 'ini ada',
        'umur' : 90,
        'warna' : 'coklat'
    }
    res.send(data);
    next();
})

routes.get('/get-third-data', (req,res,next)=>{
    let data3 = {
        'nama' : 'ini ada 3',
        'umur' : 95,
        'warna' : 'biru'
    }
    res.send(data3);
})


module.exports = routes;
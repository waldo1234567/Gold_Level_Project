const express = require('express');
const routes = express.Router();

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

module.exports = routes;
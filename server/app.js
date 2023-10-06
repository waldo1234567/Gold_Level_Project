const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');
const path = require('path');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.set('view engine', 'ejs');

app.use('/', routes);


app.listen(port,()=> console.log(`tes dulu sekali ${port}`));
const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.get('/', (req ,res) => res.send('Halo Dunia!'));

app.use('/', routes);


app.listen(port,()=> console.log(`tes dulu sekali ${port}`));
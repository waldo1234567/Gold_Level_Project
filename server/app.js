const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
const routes = require('./routes');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret: 'gold_level',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', routes);


app.listen(port, () => console.log(`tes dulu sekali ${port}`));
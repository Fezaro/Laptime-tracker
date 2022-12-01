const express = require('express');
const app = express();
const port = 3000;
const fs=require('fs')

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (request, response) => {
    response.render('home', {name: 'Fredrick Omanyala'});
    });
app.listen(port);
console.log('Server is running on port ' + port);
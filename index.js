const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'races.json';

// load data from file and parse into json
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (request, response) => {
    response.render('home', {name: 'Fredrick Omanyala'});
    });


// This is a RESTful GET web service
app.get('/races', (request, response) => {
    // data.sort((a, b) => (a.name > b.name) ? 1 : -1 );
    response.send(data);
});

// This is a RESTful POST web service
app.post('/races', jsonParser, (request, response) => {
    data.push(request.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 3));
    response.end();
});

//This is a RESTful PUT web service or edit function
app.put('/races', (request, response) => {
    response.send("Data has been edited successfully")
  })

//This is a RESTful DELETE web service
app.delete('/races/${date}', jsonParser, (request, response) =>{
    response.send("Delete Request Called")
});


app.listen(port);
console.log('Server is running on port ' + port);
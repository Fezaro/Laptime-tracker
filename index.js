const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = "races.json";

// load data from file and parse into json
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set("views", "views");
app.set("view engine", "hbs");
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("home", { name: "Fredrick Omanyala" });
});

// This is a RESTful GET web service
app.get("/races", (request, response) => {
  // data.sort((a, b) => (a.name > b.name) ? 1 : -1 );
  response.send(data);
});

// This is a RESTful POST web service
app.post("/races", jsonParser, (request, response) => {
  data.push(request.body);
  fs.writeFileSync(fileName, JSON.stringify(data, null, 3));
  response.end();
});

//This is a RESTful PUT web service or edit function
app.put("/races/editRaces", (request, response) => {
  app.put("/races/:date", jsonParser, (request, response) => {
    const dated = request.params.date;
    // return response.send(
    //     `PUT HTTP method on races/${dated} resource`,
    //   );
    let found = data.find(function (item) {
      return item.date === dated;
    });
    if (found) {
      let updated = {
        name: found.name,
        date: found.date,
        time: found.time,
      };
      // find index of found object from array of data
      // let targetI
      // find index of found object from array of data
      let targetIndex = data.indexOf(found);

      // replace object from data list with `updated` object

      data.splice(targetIndex, 1, updated);
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });
  response.send("Data has been edited successfully");
});

//This is a RESTful DELETE web service
app.delete("/races/delete", jsonParser, (request, response) => {
  let date = request.body.date;
  data = data.filter((race) => race.date !== date);
  fs.writeFileSync(fileName, JSON.stringify(data));
  response.send("Delete Request Called");
});

app.listen(port);
console.log("Server is running on port " + port);

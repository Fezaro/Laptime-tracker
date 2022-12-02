const server = "http://localhost:3000";
var raceName;
var raceDate;
var raceTime;
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

//getting data from the user
async function fetchRaces() {
  const url = server + "/races";
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  const response = await fetch(url, options);
  const races = await response.json();
  populateContent(races);
  return races;
}

// sending data to the user
async function addRaces() {
  const url = server + "/races";
  const race = { name: raceName, date: raceDate, time: raceTime };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(race),
  };
  const response = await fetch(url, options);
}

// editing data in the json file
async function editRaces() {
  const url = server + "/races";
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(race),
  };
  const response = await fetch(url, options);
}

// deleting data in the json
async function deleteRaces() {
  const url = server + "/races/${date}";
  const options = {
    method: "DELETE",
  };
  const response = await fetch(url, options);
  console.log("inside delete function")
}
// function buttonTest(){
//     console.log("button is working")
// }

function populateContent(races) {
  var table = document.getElementById("content");
  table.innerHTML =
    "<tr><th>Race Name</th><th>Race Date</th><th>Lap time</th><th>Edit</th><th>Delete</th></tr>";
  races.forEach((race) => {
    // race name column
    var row = document.createElement("tr");
    var dataId = document.createElement("td");
    var textId = document.createTextNode(race.name);
    dataId.appendChild(textId);

    // race date column
    var dataName = document.createElement("td");
    var textName = document.createTextNode(race.date);
    dataName.appendChild(textName);

    // lap time column
    var dataTime = document.createElement("td");
    var textTime = document.createTextNode(race.time);
    dataTime.appendChild(textTime);

    //edit button column
    var dataEdit = document.createElement("td");
    var editButton = document.createElement("button");
    var editButtonText = document.createTextNode("Edit");
    editButton.classList.add("edit-button");
    editButton.appendChild(editButtonText);
    dataEdit.appendChild(editButton);

    //delete button column
    var dataDelete = document.createElement("td");
    var deleteButton = document.createElement("button");
    var deleteButtonText = document.createTextNode("Delete");
    deleteButton.classList.add("delete-button");
    deleteButton.appendChild(deleteButtonText);
    dataDelete.appendChild(deleteButton);
    deleteButton.onclick = deleteRaces;

    // appending content to the specific row
    row.appendChild(dataId);
    row.appendChild(dataName);
    row.appendChild(dataTime);
    row.appendChild(dataEdit);
    row.appendChild(dataDelete);
    table.appendChild(row);
  });
}
//fetching data that user has input
document.querySelector("form").addEventListener("submit", (e) => {
  raceName = document.getElementById("event-name").value;
  raceDate = document.getElementById("event-time").value;
  raceTime = document.getElementById("laptime").value;
  if (raceName && raceDate && raceTime) {
    addRaces();
    fetchRaces();
  }
  e.preventDefault();
  drawChart();
});

// showing data has been saved
function alertSave() {
  alert("data has been saved");
}

async function drawChart() {
  let raceData = [];
  await fetchRaces().then((races) => {
    races.forEach((race) => raceData.push([race.name, parseInt(race.time)]));
  });
  console.log(raceData);
  let data = new google.visualization.DataTable();

  data.addColumn("string", "Race");
  data.addColumn("number", "Laptime");

  data.addRows(raceData);

  var options = {
    title: "100 and 200 Meters Races",
    curveType: "function",
    legend: { position: "bottom" },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );

  chart.draw(data, options);
}

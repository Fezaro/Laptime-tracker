const server = "http://localhost:3000";
var raceId;
var raceName;
var raceTime;
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

//   alert("Main.JS reporting for duty")

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

async function addRaces() {
  const url = server + "/races";
  const race = { id: raceId, name: raceName, time: raceTime };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(race),
  };
  const response = await fetch(url, options);
}

function populateContent(races) {
  var table = document.getElementById("content");
  table.innerHTML =
    "<tr><th>Race Name</th><th>Race Date</th><th>Lap time</th></tr>";
  races.forEach((race) => {
    var row = document.createElement("tr");
    var dataId = document.createElement("td");
    var textId = document.createTextNode(race.id);
    dataId.appendChild(textId);
    var dataName = document.createElement("td");
    var textName = document.createTextNode(race.name);
    dataName.appendChild(textName);
    var dataTime = document.createElement("td");
    var textTime = document.createTextNode(race.time);
    dataTime.appendChild(textTime);

    row.appendChild(dataId);
    row.appendChild(dataName);
    row.appendChild(dataTime);
    table.appendChild(row);
  });
}
//detching data that user has input
document.querySelector("form").addEventListener("submit", (e) => {
  raceId = document.getElementById("event-name").value;
  raceName = document.getElementById("event-time").value;
  raceTime = document.getElementById("laptime").value;
  if (raceId && raceName && raceTime) {
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
    races.forEach((race) => raceData.push([race.id, parseInt(race.time)]));
  });
  console.log(raceData)
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

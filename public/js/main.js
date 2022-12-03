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
  const url = server + "/races/editRaces";
  const race = { name: raceName, date: raceDate, time: raceTime };
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(races),
  };
  const response = await fetch(url, options);
  console.log("inside edit Button function");
  drawChart();
  let races=fetchRaces();
  populateContent(races);
}

// deleting data in the json
async function deleteRaces(button) {
  let row = button.parentNode.parentNode;
  let cells = row.cells;
  let name = cells[0].innerHTML;
  let date = cells[1].innerHTML;
  let time = cells[2].innerHTML;
  const url = server + "/races/delete";
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, date, time }),
  };
  const response = await fetch(url, options);
  console.log("inside delete function");
  drawChart();
  let races=fetchRaces();
  populateContent(races);
}

// function to create table with races and details
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
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#Modal2");
    editButton.onclick = ()=>editRaces(editButton);


    //delete button column
    var dataDelete = document.createElement("td");
    var deleteButton = document.createElement("button");
    var deleteButtonText = document.createTextNode("Delete");
    deleteButton.classList.add("delete-button");
    deleteButton.appendChild(deleteButtonText);
    dataDelete.appendChild(deleteButton);
    deleteButton.onclick = ()=>deleteRaces(deleteButton);

    // appending content to the specific row
    row.appendChild(dataId);
    row.appendChild(dataName);
    row.appendChild(dataTime);
    row.appendChild(dataEdit);
    row.appendChild(dataDelete);
    table.appendChild(row);
  });
}

//fetching data that user has input using event listeners
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

//function to draw chart
async function drawChart() {
  let raceData = [];
  await fetchRaces().then((races) => {
    races.forEach((race) => raceData.push([race.name, parseFloat(race.time)]));
  });
  let data = new google.visualization.DataTable();

  data.addColumn("string", "Race");
  data.addColumn("number", "Laptime");

  data.addRows(raceData);

  var options = {
    title: "100 Meters Races",
    curveType: "function",
    legend: { position: "bottom" },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );

  chart.draw(data, options);
}

// return median
function getSortedArray(arr){
	return arr.slice().sort((a, b) => a - b);
}
function findMedian(inputArray) {
	let sortedArr = getSortedArray(inputArray);
	let inputLength = inputArray.length;
	let middleIndex = Math.floor(inputLength / 2);
	let oddLength = inputLength % 2 != 0;
	let median;
	if(oddLength) { // if array length is odd -> return element at middleIndex
		median = sortedArr[middleIndex];
	} else {
		median = (sortedArr[middleIndex] + sortedArr[middleIndex - 1]) / 2;
	}
	return median;
}


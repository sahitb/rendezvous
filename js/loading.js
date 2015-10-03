var names = [];
var airports = [];
var destinations = [];
var costs = [];
var min_destination = 0;
var groupMode = false;
var clicked_Once = false;
var bestsum = 1000000;
var bestCoordinates;
var best = 0;
var homes = [];
var dateDepart = 0;
var dateReturn = 0; 
var destinationsID = [];
var ExpediaKey = "X8vOe6BbHkoqGOBlzVoJZCLAnYbAusCQ";

// Function is called when loading.html is loaded. Decides which method to calculate.
function decideCalculation(){
	groupMode = localStorage.groupMode;
	dateDepart = localStorage.dateDepart;
	dateReturn = localStorage.dateReturn;
	names = JSON.parse(localStorage.names);
	airports = JSON.parse(localStorage.airports);
  console.log(airports);
	destinations = JSON.parse(localStorage.destinations);
	console.log(destinations[0]);
	if(groupMode){
		calculateGroup();
	}
	else{
		console.log("indi runs");
		calculateIndividual();
	}
}

// Calculates group to specific selected destinations
function calculateGroup(){

  for (var i = 0; i < destinations.length; i++) { 
    
    (function(i) {
      var data = destinations[i].toString();
      data = data.replace('-', '');
      //console.log(data);
      setTimeout(function(){
      $.getJSON("http://terminal2.expedia.com/x/suggestions/regions?", {query: data, apikey: ExpediaKey})
        .done(function(json) { 
          
          destinationsID.push(json.sr[0].id);
          if (destinationsID.length == destinations.length) {
            getCosts();
          }
          
        })
        .fail(function() {
            alert("Please reload the page!");
            console.log("Expedia Suggestions API failed");
        });
        }, 1000 * i);
    })(i);
    
  }
  /*$.each(destinations, function (i, item) {
    console.log(item);
    $.getJSON("http://terminal2.expedia.com/x/suggestions/regions?", {query: item, apikey: ExpediaKey})
        .done(function(json) { 
           console.log(i);
           console.log(destinations.length);
           destinationsID.push(json.sr[0].id);
           if (i == destinations.length - 1) {
            console.log(destinationsID);
           }
          
        })
        .fail(function() {
            console.log("Expedia Suggestions API failed");
        });
  });
*/
}

//Get costs from expedia api
function getCosts(){
  console.log(destinationsID);
  console.log(airports);
  for (var i = 0; i < airports.length; i++) {
    (function(i) {
        for (var j = 0; j < destinations.length; j++) {
          (function(j) {
           setTimeout(function(){
            
                var origin = airports[i].toString().substring(airports[i].length-3);
                console.log("Origin:" + origin);
                var destination = destinations[j].toString().substring(destinations[j].length-3);
                console.log("Destination:" + destination);
                var data = {
                  departureDate: dateDepart,
                  originAirport: origin,
                  destinationAirport: destination,
                  returnDate: dateReturn,
                  regionid: destinationsID[j],
                  adults: 1,
                  limit: 1,
                  apikey: ExpediaKey
                }
                $.getJSON("http://terminal2.expedia.com/x/packages?", data)
                  .done(function(json) {

                    var detail = {origin: origin, destination: destination, price: json.FlightList.Flight.FlightPrice.TotalRate.Value, name: names[i]};
                    costs.push(detail);
                    if (costs.length == airports.length * destinations.length) {
                      calculateBestFlightV1();
                    }
                  })
                  .fail(function() {
                      alert("Please reload the page!");
                  });
            

           }, 1000 * j);
          })(j);

        }
    })(i);
  }
}

function compare(a,b) {
  if (a.destination < b.destination)
    return -1;
  if (a.destination > b.destination)
    return 1;
  return 0;
}
// Calculates best flight
function calculateBestFlightV1() {
  costs.sort(compare);

  var count = 0;
  for (var i = 0; i < destinations.length; i++) {
    var sum = 0;
    for (var j = 0; j < airports.length; j++) {
      sum += parseFloat(costs[count].price);
      count++;
    }
    if (sum < bestsum) {
      best = i;
      console.log(best);
      bestsum = sum.toFixed(2); 
    }
  }
  
  for (var i = 0; i < costs.length; i++) {
    if (String(costs[i].destination) != destinations[best].toString().substring(destinations[best].length-3)) {
      costs.splice(i--,1);
    }
  }

  var worldAirports;
    $.getJSON("https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json", function(json) { 
        worldAirports = json;
      $.each(worldAirports, function(k,airportItem){
        for (var i = 0; i < airports.length; i++) {
              if (airportItem.iata == airports[i].substring(airports[i].length-3)) {
                var x = {lat: airportItem.lat, lon: airportItem.lon};

                console.log(x);
                console.log(typeof homes);
                homes.push(x);
              }
          }
          if (destinations[best].substring(destinations[best].length-3) == airportItem.iata) {
            bestCoordinates = {lat: airportItem.lat, lon: airportItem.lon};
            localStorage.bestCoordinates = JSON.stringify(bestCoordinates);
            console.log(typeof localStorage.bestCoordinates);
            
          }

      });
      localStorage.best = best;
      //debugger;
      localStorage.costs = JSON.stringify(costs);
      localStorage.homes = JSON.stringify(homes);
      $('#results')[0].click();
  });
}

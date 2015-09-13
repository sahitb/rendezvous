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
var date; 


function showFailure() 
{
   document.getElementById('failureAlert').style.display = "block";
   document.getElementById('successAlert').style.display = "none";

}

function showSuccess() 
{
   document.getElementById('successAlert').style.display = "block";
   document.getElementById('failureAlert').style.display = "none";
}

function decisionMode(){
	if(clicked_Once){
		if(destinations.length > 0){
			localStorage.groupMode = groupMode;
			localStorage.date = date;
			localStorage.names = names;
			localStorage.airports = airports;
			localStorage.destinations = destinations;
			$("#loading_page")[0].click();
		}
		else{
			$('#noDestination').css("display", "block");
		}
	}
	else{
		clicked_Once = true;
		if(groupMode){
			groupComplete();
		}
		else{
			localStorage.groupMode = groupMode;
			localStorage.date = date;
			localStorage.names = names;
			localStorage.airports = airports;
			localStorage.destinations = destinations;
			$("#loading_page")[0].click();
		}
	}
}

function decideCalculation(){
	groupMode = localStorage.groupMode;
	date = localStorage.date;
	names = localStorage.names;
	airports = localStorage.airports;
	destinations = localStorage.destinations;
	console.log(groupMode);
	if(groupMode){
		calculateGroup();
	}
	else{
		console.log("indi runs");
		calculateIndividual();
	}
}

function groupComplete()
{
	if(names.length == 0){
		$('#noGroup').css("display", "block");
	}
	else{
		$('#travellerForm').fadeOut('slow');
		$('#travellerForm_Instructions').fadeOut('slow');
		$('#destinationForm_Instructions').fadeIn('slow');
		$('#destination_Form').fadeIn('slow');
		$('#traveller_table').fadeOut('slow');
		$('#destination_table').fadeIn('slow');
		$('#group_Complete').html("Calculate My Trip!");
	}
}

function travellerSubmitted()
{
	$('#noGroup').css('display', 'none');
	if ((document.getElementById("travellerForm").elements[0].value == "") || 
		(document.getElementById("travellerForm").elements[1].value == ""))
	{
		showFailure();
	}
	else
	{
		names.push(document.getElementById("travellerForm").elements[0].value);
		airports.push(document.getElementById("travellerForm").elements[1].value);
		showSuccess();
		$('#travtable').append('<tr><td>' + names[names.length - 1] + '</td><td>' + airports[airports.length - 1] + '</td></tr>');
		document.getElementById("travellerForm").reset();
	}
}

function dateSubmitted(){
	if(document.getElementById("dateInput").value == ""){
		$('#noDate').css("display", "block");
	}
	else if(document.getElementById("first_radio").checked == false && 
		document.getElementById("second_radio").checked == false){
		$('#noMode').css("display", "block");
		$('#noDate').css("display", "none");
	}
	else{
		if(document.getElementById("second_radio").checked == true){
			console.log("groupmode is true");
			groupMode = true;
		}
		$('#noDate').css("display", "none");
		$('#noMode').css("display", "none");
		$('.navbar').css("display", "none");
		date = document.getElementById("dateInput").value;
		$('#jump')[0].click();
	}
}

function destinationSubmitted(){
	if(document.getElementById("destination").value == ""){
		$("#falseDestination").css("display", "block");
	}
	else{
		destinations.push(document.getElementById("destination").value);
		showSuccess();
		$('#desttable').append('<tr><td>' + destinations[destinations.length - 1] + '</td></tr>');
		document.getElementById("destination_Form").reset();
		/*
		$("#falseDestination").css("display", "none");
		destinations.push(document.getElementById("destination").innerHTML);
		$('#destinationAdded').css("display", "block");
		$('#desttable').append('<tr><td>' + destinations[destinations.length - 1] + '</td></tr>');
		document.getElementById("destination_Form").reset();
		*/
	}
	
}
// 
function calculateGroup(){
	console.log("i continue to execute");
	var costs = new Array(airports.length);
	for (var i = 0; i < airports.length; i++) {
		costs[i] = new Array(airports.length);
	}

	for (var i = 0; i < airports.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
                

                	console.log(date);
                	console.log(airports[i].substring(airports[i].length-3));
                	console.log(destinations[j].substring(destinations[j].length-3));
                    var FlightRequest = {
                      "request": {
                        "slice": [
                          {
                            "origin": airports[i].substring(airports[i].length-3),
                            "destination": destinations[j].substring(destinations[j].length-3),
                            "date": date
                          }
                        ],
                        "passengers": {
                          "adultCount": 1,
                          "infantInLapCount": 0,
                          "infantInSeatCount": 0,
                          "childCount": 0,
                          "seniorCount": 0
                        },
                        "solutions": 2,
                        "refundable": false
                      }
                    };



                    var myData = {};
                    $.ajax({
                     type: "POST",
                     //Set up your request URL and API Key.
                     url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBAauokW8lbtBNshsYEybcNVtVpvirSrZU&fields=trips(tripOption/saleTotal)", 
                     contentType: 'application/json', // Set Content-type: application/json
                     dataType: 'json',
                     // The query we want from Google QPX, This will be the variable we created in the beginning
                     data: JSON.stringify(FlightRequest),
                     async: false,
                     success: function (data) {
                      //Once we get the result you can either send it to console or use it anywhere you like.
                      console.log(data.trips.tripOption[0].saleTotal);
                      myData.data = data.trips.tripOption[0].saleTotal;
                    },
                      error: function(){
                       //Error Handling for our request
                       alert("Access to Google QPX Failed.");
                     }
                    });

					costs[i][j] = Number(myData.data.substring(3));

            }
    }

    console.log("contacted google!");

    for (var i = 0; i < destinations.length; i++) {
            var sum = 0;
            for (var j = 0; j < airports.length; j++) {
                sum += costs[j][i];
            }
            
            if (sum < bestsum) {
                    best = j;
                    bestsum = sum;
            }
    }
    console.log("halfway");
    var worldAirports;
    $.getJSON("https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json", function(json) { 
        worldAirports = json;
	    $.each(worldAirports, function(k,airportItem){
	    	$('#results')[0].click();
	    	for (var i = 0; i < airports.length; i++) {
	            if (airportItem.iata == airports[i].substring(airports[i].length-3)) {
	            	var x = {lat: airportItem.lat, lon: airportItem.lon};
	            	console.log(x);
	            	homes.push(x);
	            }
	        }
	        
	        if (destinations[best].substring(airports[i].length-3) == airportItem.iata) {
	        	bestCoordinates = {lat: airportItem.lat, lon: airportItem.lon};
	        }

	    });
	});


	//console.log(homes);
	console.log("here");
    console.log(costs);
    console.log(bestsum);
    console.log("there");
    buildMap();
    printResults();
    $('#results')[0].click();
}

// Travelling to friends place
function calculateIndividual(){
	var costs = new Array(airports.length);
	for (var i = 0; i < airports.length; i++) {
		costs[i] = new Array(destinations.length);
	}

	console.log("in calculate!");
	for (var i = 0; i < airports.length; i++) {
            for (var j = 0; j < airports.length; j++) {
                if (i != j) {
                    var FlightRequest = {
                      "request": {
                        "slice": [
                          {
                            "origin": airports[i].substring(airports[i].length-3),
                            "destination": airports[j].substring(airports[j].length-3),
                            "date": date
                          }
                        ],
                        "passengers": {
                          "adultCount": 1,
                          "infantInLapCount": 0,
                          "infantInSeatCount": 0,
                          "childCount": 0,
                          "seniorCount": 0
                        },
                        "solutions": 2,
                        "refundable": false
                      }
                    };

                    var myData = {};
                    $.ajax({
                     type: "POST",
                     //Set up your request URL and API Key.
                     url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCKdzmljdq6bSuSHnXn-2aQNnt-8cUmdRI&fields=trips(tripOption/saleTotal)", 
                     contentType: 'application/json', // Set Content-type: application/json
                     dataType: 'json',
                     // The query we want from Google QPX, This will be the variable we created in the beginning
                     data: JSON.stringify(FlightRequest),
                     async: false,
                     success: function (data) {
                      //Once we get the result you can either send it to console or use it anywhere you like.
                      console.log(data.trips.tripOption[0].saleTotal);
                      myData.data = data.trips.tripOption[0].saleTotal;
                    },
                      error: function(){
                       //Error Handling for our request
                       alert("Access to Google QPX Failed.");
                     }
                    });

					costs[i][j] = Number(myData.data.substring(3));

                }
                else {
                	costs[i][j] = 0;
                }

            }
    }

    console.log("contacted google!");

    for (var i = 0; i < airports.length; i++) {
            var sum = 0;
            for (var j = 0; j < airports.length; j++) {
                sum += costs[j][i];
            }
            
            if (sum < bestsum) {
                    best = j;
                    bestsum = sum;
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
	            	homes.push(x);
	            }
	        }
	        
	        if (airports[best].substring(airports[i].length-3) == airportItem.iata) {
	        	bestCoordinates = {lat: airportItem.lat, lon: airportItem.lon};
	        }

	    });
	});

        console.log(costs);
        console.log(bestsum);
        buildMap();
        printResults();
    $('#results')[0].click();
}

function buildMap() {
	var friend_loc = [];  
  	var final_dest  = new google.maps.LatLng(bestCoordinates.lat, bestCoordinates.lon); 

	   for(var i = 0; i < homes.length(); ++i) { 
	 
	      friend_loc[i] = new google.maps.LatLng(homes[i].lat, homes[i].lon); 
	   }

	    var map_initialize = function () {
	          var My_map = {
	               center: final_dest,
	               zoom: 1,
	               mapTypeId: google.maps.MapTypeId.ROADMAP
	          }; 
	           var map = new google.maps.Map(document.getElementById("googleMap"), My_map); 
	      
	          //marker for each friend
	          var friend_marker = []; 
	          for(var j = 0; j < homes.length; ++j) {
	            friend_marker[j] = new google.maps.Marker({ position: friend_loc[j] });
	            friend_marker[j].setMap(map);
	          }

	          var meet_city = new google.maps.Circle({
	              center: final_dest,
	              radius:200000,
	              strokeColor:"#0000FF",
	              strokeOpacity:1.8,
	              strokeWeight:1,
	              fillColor:"#0000FF",
	              fillOpacity:0.6
	             });
	           meet_city.setMap(map);

	         //lines connecting friends to the final destination 
	         var flight_path = []; 

	         for(var k = 0; k < homes.length; ++k) {
	          
	          flight_path[k] = new google.maps.Polyline({
	          path:[final_dest, friend_loc[k]],
	          strokeColor:"#CC0000",
	          strokeOpacity:0.8,
	          strokeWeight:2
	          })
	          flight_path.setMap(map);;

	         }
	   }

	   google.maps.event.addDomListener(window, 'load', map_initialize);
}


function printResults(){
	if(groupMode){
		document.getElementById('end_goal').innerHTML = destinations[best];
	}
    else{
    	document.getElementById('end_goal').innerHTML = airports[best];
    }
    document.getElementById('date_of_departure').innerHTML = date;
    for(var i = 0; i < names.length; ++i){
    	$('#result_table').append('<tr><td>' + names[i] + '</td><td>' + costs[i][best] + '</td><td>' + airports[i] + '</td></tr>');
    }
}







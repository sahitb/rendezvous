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


function dateSubmitted(){
	$('#noDate').css("display", "none");
	$('#noDate2').css("display", "none");

	if(document.getElementById("dateInput").value == ""){
		$('#noDate').css("display", "block");
	}
	else if (document.getElementById("dateInput2").value == "") {
		$('#noDate2').css("display", "block");
	}
	/*else if(document.getElementById("first_radio").checked == false && 
		document.getElementById("second_radio").checked == false){
		$('#noMode').css("display", "block");
		$('#noDate').css("display", "none");
	}*/
	else{
		
			console.log("groupmode is true");
			groupMode = true;
		$('#noDate').css("display", "none");
		$('#noDate2').css("display", "none");
		$('#noMode').css("display", "none");
		$('.navbar').css("display", "none");
		dateDepart = document.getElementById("dateInput").value;
		dateReturn = document.getElementById("dateInput2").value;
		console.log(dateDepart);
		console.log(dateReturn);
		$('#jump')[0].click();
	}
}

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
			localStorage.dateDepart = dateDepart;
			localStorage.dateReturn = dateReturn;
			localStorage.names = JSON.stringify(names);
			localStorage.airports = JSON.stringify(airports);
			localStorage.destinations = JSON.stringify(destinations);
			
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
			localStorage.dateDepart = dateDepart;
			localStorage.dateReturn = dateReturn;
			localStorage.names = JSON.stringify(names);
			localStorage.airports = JSON.stringify(airports);
			localStorage.destinations = JSON.stringify(destinations);
			
			$("#loading_page")[0].click();
		}
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

function destinationSubmitted(){
	if(document.getElementById("destination").value == ""){
		$("#falseDestination").css("display", "block");
	}
	else{

		destinations.push(document.getElementById("destination").value);
		showSuccess();
		$('#desttable').append('<tr><td>' + destinations[destinations.length - 1] + '</td></tr>');
		document.getElementById("destination_Form").reset();
	}
	
}
// 


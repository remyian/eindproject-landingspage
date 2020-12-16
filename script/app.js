//iedere seconde herladen
var intervalID = window.setInterval(myCallback, 1000);

function myCallback() {
	getTime();
	getPlace();

	//kijken of het dag of nacht is lokaal en het wolkje ernaar aanpassen
	var hourLocal = new Date().getHours();
	if(hourLocal >= 18 || hourLocal <= 6) {
		LocalDark();
	} else {
		LocalLight();
	}

	//kijken of het dag of nacht is chosen en het wolkje ernaar aanpassen
	var hourChosen = document.querySelector('.js-chosen-time').innerText.split(':')[0]
	if(hourChosen >= 18 || hourChosen <= 6) {
		ChosenDark();
	} else {
		ChosenLight();
	}
}

function LocalDark() {
    var img = document.getElementById('js-Local-image');
	img.src='img/iconfinder_Weather_Weather_Forecast_Moon_Night_Cloud_3859140.png';
	img.style.width="200px"
	img.style.padding= "1rem";
}
function LocalLight() {
    var img = document.getElementById('js-Local-image');
	img.src = 'img/iconfinder_weather02_4102326.png';
	img.style.width="200px"
}
function ChosenDark() {
    var img = document.getElementById('js-Chosen-image');
	img.src='img/iconfinder_Weather_Weather_Forecast_Moon_Night_Cloud_3859140.png';
	img.style.width="200px"
	img.style.padding= "1rem";
}
function ChosenLight() {
    var img = document.getElementById('js-Chosen-image');
	img.src = 'img/iconfinder_weather02_4102326.png';
	img.style.width="200px"
}



//--------------------------------------------------------------------------------------------------------------------------------------
//							LOCAL
//--------------------------------------------------------------------------------------------------------------------------------------
//tijd ophalen
const getTime = () =>{
	var d = new Date(); // for now
	document.querySelector('.js-local-time').innerText = d.getHours().toString() + ":"+d.getMinutes().toString();
	getCoordintes(); //local stad ophalen
};

//stad ophalen aan de hand van de cooridinaten en LocationIQ api
function getCoordintes() { 
	var options = { 
		enableHighAccuracy: true, 
		timeout: 5000, 
		maximumAge: 0 
	}; 
	function success(pos) { 
		var crd = pos.coords; 
		var lat = crd.latitude.toString(); 
		var lng = crd.longitude.toString(); 
		var coordinates = [lat, lng]; 
		getCity(coordinates); 
		return; 
	} 
	function error(err) { 
		console.warn(`ERROR(${err.code}): ${err.message}`); 
	} 
	navigator.geolocation.getCurrentPosition(success, error, options); 
} 

function getCity(coordinates) { 
	var xhr = new XMLHttpRequest(); 
	var lat = coordinates[0]; 
	var lng = coordinates[1]; 

	xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.61d4f9658af8c096859f4e3fb152ba66&lat=" + lat + "&lon=" + lng + "&format=json", true); 
	xhr.send(); 
	xhr.onreadystatechange = processRequest; 
	xhr.addEventListener("readystatechange", processRequest, false); 

	function processRequest(e) { 
		if (xhr.readyState == 4 && xhr.status == 200) { 
			var response = JSON.parse(xhr.responseText); 
			var city = response.address.village; 
			document.querySelector('.js-location').innerText = city;
			return; 
		} 
	} 
} 


//--------------------------------------------------------------------------------------------------------------------------------------
//							CHOSEN
//--------------------------------------------------------------------------------------------------------------------------------------
//tijd van de gekozen stad ophalen
function getPlace() { 
	var sel = document.getElementById("place");
	var city = sel.options[sel.selectedIndex].value;
	getTimeZone(city);
}



// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
	console.log({queryResponse});
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getTimeZone = async(city) => {
	// Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
	const data = await fetch(`http://api.weatherapi.com/v1/timezone.json?key=${key}&q=${city}`)
	.then((r)=> r.json())
	.catch((err)=> console.error('an arror accured:', err)); 
	var obj = data;
	var localtime= obj.location.localtime.toString();
	const arr = localtime.split(/ (.*)/);
	document.querySelector('.js-chosen-time').innerText = arr[1];
	// Als dat gelukt is, gaan we naar onze showResult functie.
	//showResult(data);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getTime();
	LocalDark();
	ChosenLight()
});
var inputAreaCharacters;
var cityName;
var cityNameValue;
var forecastContainer;
var phoneNumber;
var exchangeRateContainer;
var submitBtn;
var phoneNumberRegex;
var flag = false;

document.addEventListener('DOMContentLoaded', function(){ init(); });

function init() {
	phoneNumberRegex = /^\+?[0-9]{3}\([0-9]{2}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
	inputAreaCharacters = document.getElementById("characters");
	phoneNumber = document.getElementById("phone-number");
	cityName = document.getElementById("city-name");
	forecastContainer = document.getElementById("forecast");
	exchangeRateContainer = document.getElementById("exchange-rate");
	submitBtn = document.getElementById("submitbtn");
	submitBtn.disabled = true;
	document.getElementById("dropdown-btn").onclick = function() {toggleMenu()};
	inputAreaCharacters.onblur = function() {checkLength();};
	cityName.onblur = function() {getForecast();};
	phoneNumber.onblur = function() {validatePhoneNumber(); validateAll()};
	document.getElementById("resetbtn").onclick = function() {resetAllFields()};
	submitBtn.onclick = function() {getExchangeRate()};
}

function toggleMenu() {
	var menuContent = document.getElementById("dropdown-content");
	if (menuContent.style.display === "none") {
		menuContent.style.display = "block"
	} else {
		menuContent.style.display = "none"
	}
}

function checkLength() {
	if (inputAreaCharacters.value.length < 16) {
		inputAreaCharacters.focus();	
	} 
}


function getForecast() {
	cityNameValue = cityName.value;
	var forecastRequest = new XMLHttpRequest();
	forecastRequest.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
     		var forecastData = JSON.parse(forecastRequest.responseText);
			renderForecastHTML(forecastData);
			flag = true;
    	} 
    	if (this.readyState == 4 && this.status == 404) {
    		forecastContainer.innerHTML = "";
    		forecastContainer.insertAdjacentHTML('beforeend', "<p>No such city!</p>");
    		cityName.focus();
    		flag = false;
    	}
  	};
	forecastRequest.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityNameValue + '&units=metric&appid=8894d217890a53909512a84e974f3f2a');
	forecastRequest.send();
}

function renderForecastHTML (data) {
	var forecastHTML = "";
	var cityName = data.city.name;
	var timestamp = data.list[0].dt;
	var date = new Date(timestamp*1000);
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var dayOfWeek = days[date.getDay()];
	var temperature = Math.round(data.list[0].main.temp);
	var humidity = data.list[0].main.humidity;
	var windSpeed = data.list[0].wind.speed;
	var weatherDescription = data.list[0].weather[0].description;

	forecastHTML += "<p>City Name: " + cityName + "</p>" + "<p>" + dayOfWeek + "</p>" + "<p>Temperature: " + temperature + "&#8451;</p>" + "<p>Weather Description: " + weatherDescription + "</p>" + "<p>Wind Speed: " + windSpeed + " meter/sec</p>" + "<p>Humidity: " + humidity + "%</p>";
	forecastContainer.innerHTML = "";
	forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
}

// +XXX(XX)XXX-XX-XX

function validatePhoneNumber () {					   
	if (phoneNumber.value.match(phoneNumberRegex)) {
		phoneNumber.disabled = true;
	} else {
		// phoneNumber.focus();
	}

}

function resetAllFields () {
	document.getElementById("my-form").reset();
	document.activeElement.blur();
	phoneNumber.disabled = false;
	forecastContainer.innerHTML = "";
	exchangeRateContainer.innerHTML = "";
}

function getExchangeRate () {
	var exchangeRateRequest = new XMLHttpRequest();
	exchangeRateRequest.open('GET', 'http://apilayer.net/api/live?access_key=5ca928f875a80cd7c342d31512053b93&currencies=AUD,CHF,EUR,GBP,RSD')
	exchangeRateRequest.onload = function() {
		var exchangeRateData = JSON.parse(exchangeRateRequest.responseText);
		renderExchangeRateHTML(exchangeRateData);
	};

	exchangeRateRequest.send();
}

function renderExchangeRateHTML (data) {
	var exchangeRateHTML = "";
	var sourceValute = data.source;
	var australianDollar = data.quotes.USDAUD;
	var swissFranc = data.quotes.USDCHF;
	var euro = data.quotes.USDEUR;
	var dinar = data.quotes.USDRSD;

	exchangeRateHTML += "<p>Valute: " + sourceValute + "</p>" + "<p>Australian Dollar: " + australianDollar + "</p>" + "<p>Swiss Franc: " + swissFranc + "</p>" + "<p>Euro: " + euro + "</p>" + "<p>Serbian Dinar: " + dinar + "</p>";
	exchangeRateContainer.innerHTML = "";
	exchangeRateContainer.insertAdjacentHTML('beforeend', exchangeRateHTML);
}

function validateAll () {
	var canSubmit1 = false;
	var canSubmit2 = false;
	var canSubmit3 = false;
	if (inputAreaCharacters.value.length == 16) {
		canSubmit1 = true;
	} else {
		canSubmit1 = false;
	}
	if (flag) {
		canSubmit2 = true;
	} else {
		canSubmit2 = false;
	}
	if (phoneNumber.value.match(phoneNumberRegex)) {
		canSubmit3 = true;
	} else {
		canSubmit3 = false;
	}

	if(canSubmit1 && canSubmit2 && canSubmit3) {
		submitBtn.disabled = false;
	} else {
		submitBtn.disabled = true;
	}
}
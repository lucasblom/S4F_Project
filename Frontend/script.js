// * Note: For better readability, consider using the 'Better Comments" extension for VS Code *

// ! Imports
import { countryList } from '../Backend/country.js';

// Defining some variables
var latitude = 0
var longitude = 0

// ! DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Form submitted");
        console.log(getInformationFromFrom());

        location(getInformationFromFrom()[0], getInformationFromFrom()[2])
        logJSONData(latitude, longitude)
        document.querySelector("form").style = "width: 80%; transition: 0.5s;"
    })
})


// ! Functions
// Takes in information given from HTML from and returns an array with the city, country and country code
// src: /Frontend/index.html
function getInformationFromFrom() {
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;
    const country_code = countryList[country];
    return [city, country, country_code];
}

// Takes in the city and country code and returns the latitude and longitude of the location
async function location(city, country_code) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country_code}&appid=1d5099211a967e079092731876b2c1cc`);
    const locationData = await response.json();
    latitude = locationData[0].lat
    longitude = locationData[0].lon
    console.log(locationData[0].name + " " + locationData[0].country + "\n" + 'Latitude: ' + locationData[0].lat + " \n" + 'Longitude: ' + locationData[0].lon + '\n')
}

// Takes in the latitude and longitude and logs the weather data
async function logJSONData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall,precipitation_probability,visibility,windspeed_10m,winddirection_10m`);
    const jsonData = await response.json();
    // refers to the function 'filterByDate' and passes the current date and the weatherData array
    filterByDate(currentDate(), jsonData)
}


// takes in the date and time from the weatherData array and returns the date and time in a readable format 
function convertTime(time) {
    let date = []
    date = time.split("T")
    return date
}

// takes in the degrees and returns the cardinal direction
function caridnalDirection(degrees) {
    let direction = ""
    if (degrees >= 0 && degrees < 22.5) direction = "N"
    else if (degrees >= 22.5 && degrees < 67.5) direction = "NE"
    else if (degrees >= 67.5 && degrees < 112.5) direction = "E"
    else if (degrees >= 112.5 && degrees < 157.5) direction = "SE"
    else if (degrees >= 157.5 && degrees < 202.5) direction = "S"
    else if (degrees >= 202.5 && degrees < 247.5) direction = "SW"
    else if (degrees >= 247.5 && degrees < 292.5) direction = "W"
    else if (degrees >= 292.5 && degrees < 337.5) direction = "NW"
    else if (degrees >= 337.5 && degrees < 360) direction = "N"
    else direction = "Error"
    return direction
}

// returns the current date
function currentDate() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (day < 10) {
        day = "0" + day
    }
    if (month < 10) {
        month = "0" + month
    }
    let currentDate = year + "-" + month + "-" + day
    return currentDate
}

function tomorrow() {
    let tmrw = new Date()
    let tmrwday = tmrw.getDate() + 1
    let tmrwmonth = tmrw.getMonth() + 1
    let tmrwyear = tmrw.getFullYear()
    if (tmrwday < 10) {
        tmrwday = "0" + tmrwday
    }
    if (tmrwmonth < 10) {
        tmrwmonth = "0" + tmrwmonth
    }
    let tomorrowDate = tmrwyear + "-" + tmrwmonth + "-" + tmrwday
    return tomorrowDate
}

// takes in the date and weatherData array and logs the weather data for that date
function filterByDate(date, data) {
    let filteredData = []
    for (let i = 0; i in data.hourly.time; i++) {
        if (convertTime(data.hourly.time[i])[0] == date && parseInt(convertTime(data.hourly.time[i])[1].split(":")[0]) >= new Date().getHours()) {
            // clears lst every time the loop runs
            let lst = {}
            lst["time"] = convertTime(data.hourly.time[i])
            lst["temperature"] = data.hourly.temperature_2m[i] + "°C"
            lst["rain"] = data.hourly.rain[i] + "mm"
            lst["snowfall"] = data.hourly.snowfall[i] + "mm"
            lst["precipitation_probability"] = data.hourly.precipitation_probability[i] + "%"
            lst["visibility"] = data.hourly.visibility[i] + "m"
            lst["windspeed"] = data.hourly.windspeed_10m[i] + "km/h"
            lst["winddirection"] = caridnalDirection(data.hourly.winddirection_10m[i]) + " (" + data.hourly.winddirection_10m[i] + "°)"
            // adds lst to the filteredData array
            filteredData.push(lst)

        }
    }
    if (filteredData.length < 24) {
        for (let i = 0; i in data.hourly.time; i++) {
            if (convertTime(data.hourly.time[i])[0] == tomorrow()) {
                let lst = {}
                lst["time"] = convertTime(data.hourly.time[i])
                lst["temperature"] = data.hourly.temperature_2m[i] + "°C"
                lst["rain"] = data.hourly.rain[i] + "mm"
                lst["snowfall"] = data.hourly.snowfall[i] + "mm"
                lst["precipitation_probability"] = data.hourly.precipitation_probability[i] + "%"
                lst["visibility"] = data.hourly.visibility[i] + "m"
                lst["windspeed"] = data.hourly.windspeed_10m[i] + "km/h"
                lst["winddirection"] = caridnalDirection(data.hourly.winddirection_10m[i]) + " (" + data.hourly.winddirection_10m[i] + "°)"
                // adds lst to the filteredData array
                filteredData.push(lst)
            }
        }
    }
    if (filteredData.length > 24) {
        // if (filteredData.length > 24) remove extra data
        filteredData.pop()[24, -1]
        console.log(filteredData.length)
    }
    // return filteredData
    displaysFiltered(filteredData)
}

function displaysFiltered (filteredData) {

    // loops through the filteredData array and displays the data on the website
    for (let i = 0; i <= 23; i++) {
        const showWeather = document.createElement("div");
        showWeather.className = "weather";
        showWeather.innerHTML = `
              <h3 class="time">${filteredData[i].time[1]}</h3>
              <h3 class="temp">Temprature: ${filteredData[i].temperature}</h3>
              <h3 class="rain">Rain: ${filteredData[i].rain}</h3>
              <h3 class="snow">Snowfall: ${filteredData[i].snowfall}</h3>
              <h3 class="vis">Visibility: ${filteredData[i].visibility}</h3>
              <h3 class="prbRain">Percipitation: ${filteredData[i].precipitation_probability}</h3>
              <h3 class="wind">Wind Speed: ${filteredData[i].windspeed}</h3>
              <h3 class="windDir">Winddirection: ${filteredData[i].winddirection}</h3>
            `;
        // Displays the weather data on the website with animation and delay
        document.getElementById("hourly").appendChild(showWeather);
    }

    // Creats a delay for the animation -> cards come in from left one after the other (see css for animation)
    for (let i = 0; i <= 23; i++) {
        setTimeout(() => {
            document.getElementsByClassName("weather")[i].style = "opacity: 1; margin-top: 0vh;"
        }, 200 * i);
    }
    document.getElementById("location").style = "display: flex; justify-content: center; align-items: center;"
    document.getElementById("location").innerHTML = getInformationFromFrom()[0] + ", " +
        getInformationFromFrom()[1] + " (" +
        getInformationFromFrom()[2] + ")"
    
}

// takes complete weather data, filteres by date and returns the averages for that date
function filterByDateAverage(data) {

}
 
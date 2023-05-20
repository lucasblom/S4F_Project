// * Note: For better readability, consider using the 'Better Comments" extension for VS Code *

// ! Imports
import { countryList } from '../Backend/country.js';

// Defining some variables
var latitude;
var longitude;
var h1 = document.getElementById('h1');

// ! DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Form submitted");
        console.log(getInformationFromFrom());
        location(getInformationFromFrom()[0], getInformationFromFrom()[2])
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
    const jsonData = await response.json();
    latitude = jsonData[0].lat
    longitude = jsonData[0].lon
    console.log(jsonData[0].name + " " + jsonData[0].country + "\n" + 'Latitude: ' + jsonData[0].lat + " \n" + 'Longitude: ' + jsonData[0].lon + '\n')
    logJSONData(latitude, longitude)
}

// Takes in the latitude and longitude and logs the weather data
async function logJSONData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall,visibility,windspeed_10m,winddirection_10m`);
    const jsonData = await response.json();
    var weatherData = []
  
    // loops through the JSON data and adds it to the weatherData array
    for (let i = 0; i in jsonData.hourly.time; i++) {
      let list = {}
      list["time"] = convertTime(jsonData.hourly.time[i])
      list["temperature"] = jsonData.hourly.temperature_2m[i] + "°C"
      list["rain"] = jsonData.hourly.rain[i] + "mm"
      list["snowfall"] = jsonData.hourly.snowfall[i] + "mm"
      list["visibility"] = jsonData.hourly.visibility[i] + "m"
      list["windspeed"] = jsonData.hourly.windspeed_10m[i] + "km/h"
      list["winddirection"] = caridnalDirection(jsonData.hourly.winddirection_10m[i]) + " (" + jsonData.hourly.winddirection_10m[i] + "°)"
      weatherData.push(list)
    }
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
    if      (degrees >= 0     && degrees < 22.5)  direction = "N"
    else if (degrees >= 22.5  && degrees < 67.5)  direction = "NE"
    else if (degrees >= 67.5  && degrees < 112.5) direction = "E"
    else if (degrees >= 112.5 && degrees < 157.5) direction = "SE"
    else if (degrees >= 157.5 && degrees < 202.5) direction = "S"
    else if (degrees >= 202.5 && degrees < 247.5) direction = "SW"
    else if (degrees >= 247.5 && degrees < 292.5) direction = "W"
    else if (degrees >= 292.5 && degrees < 337.5) direction = "NW"
    else if (degrees >= 337.5 && degrees < 360)   direction = "N"
    else direction = "Error"
    return direction
  }
 
  // returns the current date
  function currentDate () {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if (day < 10) {
      day = "0" + day
    }
    if (month < 10){
      month = "0" + month
    }
    let currentDate = year + "-" + month + "-" + day
    return currentDate
  }

  // takes in the date and weatherData array and logs the weather data for that date
  function filterByDate (date, data) {
    let filteredData = []
    for (let i = 0; i in data.hourly.time; i++) {
      if (convertTime(data.hourly.time[i])[0] == date) {
        // clears lst every time the loop runs
        let lst = {}
        lst["time"] = convertTime(data.hourly.time[i])
        lst["temperature"] = data.hourly.temperature_2m[i] + "°C"
        lst["rain"] = data.hourly.rain[i] + "mm"
        lst["snowfall"] = data.hourly.snowfall[i] + "mm"
        lst["visibility"] = data.hourly.visibility[i] + "m"
        lst["windspeed"] = data.hourly.windspeed_10m[i] + "km/h"
        lst["winddirection"] = caridnalDirection(data.hourly.winddirection_10m[i]) + " (" + data.hourly.winddirection_10m[i] + "°)"
        // adds lst to the filteredData array
        filteredData.push(lst)
      }
    }
        // loops through the filteredData array and logs the weather data
        for (let i=0; i in filteredData; i++) {
          console.log(  filteredData[i].time[0] + " " + filteredData[i].time[1] + "\n" + 
                        filteredData[i].temperature + "\n" + 
                        filteredData[i].rain + "\n" + 
                        filteredData[i].snowfall + "\n" + 
                        filteredData[i].visibility + "\n" + 
                        filteredData[i].windspeed + "\n" + 
                        filteredData[i].winddirection + "\n")
        }
  }
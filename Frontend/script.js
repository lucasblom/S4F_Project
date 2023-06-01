// * Note: For better readability, consider using the 'Better Comments" extension for VS Code *

// ! Imports
import { countryList } from '../Backend/country.js';

// Defining some variables

// ! DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    setFavIcon();
    console.log("DOM fully loaded");
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Form submitted");

        location(getInformationFromFrom()[0], getInformationFromFrom()[2])
    
        document.querySelector("form").style = "width: 40%; transition: 0.5s;"
    })
})


// ! Functions
function setFavIcon () {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDarkMode) {
        let  link =
            document.querySelector("link[rel*='icon']");
            document.createElement("link");
            link.type = "image/svg+xml";
            link.rel = "icon";
            link.href = "../pictures/Yoda.jpg";
        document.head.appendChild(link);
        document.body.style.backgroundColor = "#597684";
    } else {
        let  link =
            document.querySelector("link[rel*='icon']");
            document.createElement("link");
            link.type = "image/svg+xml";
            link.rel = "icon";
            link.href = "../pictures/Fav-Icon-Dark.svg";
        document.head.appendChild(link);
    }
}
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
    const latitude = locationData[0].lat
    const longitude = locationData[0].lon
    console.log(locationData[0].name + " " + locationData[0].country + "\n" + 'Latitude: ' + locationData[0].lat + " \n" + 'Longitude: ' + locationData[0].lon + '\n')
    logJSONData(latitude, longitude)
}

// Takes in the latitude and longitude and logs the weather data
async function logJSONData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall,precipitation_probability,visibility,windspeed_10m,winddirection_10m`);
    const jsonData = await response.json();
    // return jsonData
    filterByDate(currentDate(), jsonData)
    weekly(jsonData)
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

    if (tmrwday > 31 && tmrwmonth == 1) {tmrwday = 1; tmrwmonth = 2}
    if (tmrwday > 28 && tmrwmonth == 2) {tmrwday = 1; tmrwmonth = 3}
    if (tmrwday > 31 && tmrwmonth == 3) {tmrwday = 1; tmrwmonth = 4}
    if (tmrwday > 30 && tmrwmonth == 4) {tmrwday = 1; tmrwmonth = 5}
    if (tmrwday > 31 && tmrwmonth == 5) {tmrwday = 1; tmrwmonth = 6}
    if (tmrwday > 30 && tmrwmonth == 6) {tmrwday = 1; tmrwmonth = 7}
    if (tmrwday > 31 && tmrwmonth == 7) {tmrwday = 1; tmrwmonth = 8}
    if (tmrwday > 31 && tmrwmonth == 8) {tmrwday = 1; tmrwmonth = 9}
    if (tmrwday > 30 && tmrwmonth == 9) {tmrwday = 1; tmrwmonth = 10}
    if (tmrwday > 31 && tmrwmonth == 10) {tmrwday = 1; tmrwmonth = 11}
    if (tmrwday > 30 && tmrwmonth == 11) {tmrwday = 1; tmrwmonth = 12}
    if (tmrwday > 31 && tmrwmonth == 12) {tmrwday = 1; tmrwmonth = 1; tmrwyear++}

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
    console.log(filteredData.length)
    if (filteredData.length < 23) {
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
    }
    // return filteredData
    console.log(filteredData)
    displaysFiltered(filteredData)
}

function displaysFiltered (filteredData) {

    const hourlyContainer = document.getElementById("hourly");
      // Remove any existing weather data
    while (hourlyContainer.firstChild) {
        hourlyContainer.removeChild(hourlyContainer.firstChild);
    }

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
function weekly (data) {
    
    const weeklyContainer = document.getElementById("weekly");
        // Remove any existing weather data
        // while True: removeChild.firstChild
      while (weeklyContainer.firstChild) {
        weeklyContainer.removeChild(weeklyContainer.firstChild);
      }
  
    
    for (let i=0; i < 7; i++) {
        let weeklyData = []
        let day = currentDate().split("-")[2]
        let month = currentDate().split("-")[1]
        let year = currentDate().split("-")[0]
        day = parseInt(day) + i
        month = parseInt(month)
        year = parseInt(year)
        if (day > 31 && month == 1) {day = i; month = 2}
        if (day > 28 && month == 2) {day = i; month = 3}
        if (day > 31 && month == 3) {day = i; month = 4}
        if (day > 30 && month == 4) {day = i; month = 5}
        if (day > 31 && month == 5) {day = i; month = 6}
        if (day > 30 && month == 6) {day = i; month = 7}
        if (day > 31 && month == 7) {day = i; month = 8}
        if (day > 31 && month == 8) {day = i; month = 9}
        if (day > 30 && month == 9) {day = i; month = 10}
        if (day > 31 && month == 10) {day = i; month = 11}
        if (day > 30 && month == 11) {day = i; month = 12}
        if (day > 31 && month == 12) {day = i; month = 1; year++}

        if (day < 10) {
            day = "0" + day
        }
        if (month < 10) {
            month = "0" + month
        }
        let date = year + "-" + month + "-" + day

        for (let j=0; j < data.hourly.time.length; j++) {
            if (convertTime(data.hourly.time[j])[0] == date) {
                let lst = {}
                lst["temperature"] = data.hourly.temperature_2m[j]
                lst["rain"] = data.hourly.rain[j]
                lst["snowfall"] = data.hourly.snowfall[j]
                lst["precipitation_probability"] = data.hourly.precipitation_probability[j]
                lst["visibility"] = data.hourly.visibility[j]
                lst["windspeed"] = data.hourly.windspeed_10m[j]
                lst["winddirection"] = data.hourly.winddirection_10m[j]
                weeklyData.push(lst)
            }
        }
        displayWeekly(weeklyData)
    }
    
}

function displayWeekly (weeklyData) {
    let agvData = []
    let temp = 0
    let rain = 0
    let snowfall = 0
    let precipitation_probability = 0
    let visibility = 0
    let windspeed = 0
    let winddirection = 0

    // Loops through weeklyData and returns the averages for each day
    for (let i=0; i < weeklyData.length; i++) {
        let lst = {}
        temp += (weeklyData[i].temperature)
        rain += (weeklyData[i].rain)
        snowfall += (weeklyData[i].snowfall)
        precipitation_probability += (weeklyData[i].precipitation_probability)
        visibility += (weeklyData[i].visibility)
        windspeed += (weeklyData[i].windspeed)
        winddirection += (weeklyData[i].winddirection)
    }
    temp = temp / weeklyData.length
    rain = rain / weeklyData.length
    snowfall = snowfall / weeklyData.length
    precipitation_probability = precipitation_probability / weeklyData.length
    visibility = visibility / weeklyData.length
    windspeed = windspeed / weeklyData.length
    winddirection = winddirection / weeklyData.length
    console.log(weeklyData.length)

    agvData.push({
        "temprature": temp.toFixed(1),
        "rain":  rain.toFixed(1), 
        "snowfall": snowfall.toFixed(1),
        "precipitation":  precipitation_probability.toFixed(1), 
        "visibility": visibility.toFixed(1), 
        "windspeed": windspeed.toFixed(1),
        "winddirection": winddirection.toFixed(1)})

    // loops through the filteredData array and displays the data on the website
        const showWeather = document.createElement("div");
        showWeather.className = "column";
        showWeather.innerHTML = `
              <h3 class="temp">Temprature: ${agvData[0].temprature}</h3>
              <h3 class="rain">Rain: ${agvData[0].rain}</h3>
              <h3 class="snow">Snowfall: ${agvData[0].snowfall}</h3>
              <h3 class="vis">Visibility: ${agvData[0].visibility}</h3>
              <h3 class="prbRain">Percipitation: ${agvData[0].precipitation}%</h3>
              <h3 class="wind">Wind Speed: ${agvData[0].windspeed}</h3>
                <h3 class="windDir">Winddirection: ${caridnalDirection(agvData[0].winddirection)}(${agvData[0].winddirection})</h3>
            `;
        // Displays the weather data on the website with animation and delay
        document.getElementById("weekly").appendChild(showWeather);
}
 
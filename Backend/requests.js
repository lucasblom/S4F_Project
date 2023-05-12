import fetch from "node-fetch";
import fs from "fs";

var latitude = 0
var longitude = 0
const city = "Wetzwil"
const country = "CH"


async function location() {
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=1d5099211a967e079092731876b2c1cc`);
  const jsonData = await response.json();
  latitude = jsonData[0].lat
  longitude = jsonData[0].lon
  console.log(jsonData[0].name + " " + jsonData[0].country + "\n" + 'Latitude: ' + jsonData[0].lat + " \n" + 'Longitude: '+ jsonData[0].lon)
  logJSONData()
}

async function logJSONData() {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall,visibility,windspeed_10m,winddirection_10m`);
  const jsonData = await response.json();
  let weatherData = []

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

  fs.writeFile("weatherData.json", JSON.stringify(weatherData), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File written successfully\n");
    }
  })
}

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

function convertTime(time) {
  let date = []
  date = time.split("T")
  return date
}
location()
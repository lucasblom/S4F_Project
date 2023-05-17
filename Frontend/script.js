// ! Imports and exports
//import fs from "fs";
const fs = require("fs");

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Form submitted");
        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        console.log(city + '\n' + country);
    })
})

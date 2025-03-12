const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const apiKey = process.env.API_KEY || "95d99161b648050e7c09e73645f7314d";
const units = "imperial";

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//invoked after hitting go in the html form
app.post("/", function (req, res) {
    const zip = req.body.zipInput.trim();
    const cityId = req.body.cityIdInput.trim();
    let url = "";

    //gets infor from api weather 
    if (cityId) {
        url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=${units}&APPID=${apiKey}`;
    } else if (zip) {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=${units}&APPID=${apiKey}`;
    } else {
        return res.send("<h3>Please enter a Zip Code or City ID.</h3>");
    }

    https.get(url, function (response) {
        console.log("Response Status Code:", response.statusCode);

        if (response.statusCode !== 200) {
            return res.send("<h3>Invalid Zip Code or City ID. Try Again.</h3>");
        }

        //shows differet weather info
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            const city = weatherData.name;
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const windDirection = weatherData.wind.deg;
            const cloudiness = weatherData.clouds.all;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            displays different weather info
            res.write(`<h1>Weather in ${city}</h1>`);
            res.write(`<h2>${weatherDescription}</h2>`);
            res.write(`<h2>Temperature: ${temp} °F</h2>`);
            res.write(`<h2>Humidity: ${humidity}%</h2>`);
            res.write(`<h2>Wind Speed: ${windSpeed} mph</h2>`);
            res.write(`<h2>Wind Direction: ${windDirection}°</h2>`);
            res.write(`<h2>Cloudiness: ${cloudiness}%</h2>`);
            res.write(`<img src="${imageURL}">`);
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
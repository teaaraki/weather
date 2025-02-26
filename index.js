const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//displays index.html of root path
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//coding for form submission
app.post("/", function (req, res) {
  var city = String(req.body.cityInput);
  console.log(req.body.cityInput);

  const units = "imperial";

  //AI used to help generate code so the API key is private
  const apiKey = process.env.API_KEY || "95d99161b648050e7c09e73645f7314d";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=" +
    units +
    "&APPID=" +
    apiKey;

  // gets from open WeatherAPI data
  https.get(url, function (response) {
    console.log(response.statusCode);

    // gets individual items from Open Weather API
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const city = weatherData.name;
      const latitude = weatherData.coord.lat;
      const longitude = weatherData.coord.lon;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // displays the output of the results from open weather API
      res.write("<h1> The weather in " + city + "</h1>");
      //minor error with quote brackets for weather description, fixed with AI
      res.write("<h2>" + weatherDescription + "</h2>");
      res.write("<p>Temperature: " + temp + " F</p>");
      res.write("<p>Wind Speed: " + windSpeed + " mph</p>");
      res.write("Humidity: " + humidity + "%</p>");
      res.write("<p>Latitude: " + latitude + "</p>");
      res.write("<p>Longitude: " + longitude + "</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});

//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
});

require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    const url = __dirname + "/index.html";
    res.sendFile(url);
});

app.post("/", function(req, res) {
    console.log(req.body.cityName);

    const query = req.body.cityName;
    const units = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=" + units;

    https.get(url, function(response) {
        console.log(response.statusCode);

        let data = '';

        response.on("data", function(chunk) {
            data += chunk;
        });

        response.on("end", function() {
            if (response.statusCode === 200) {
                const weatherData = JSON.parse(data);
                const temperature = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const weatherIcon = weatherData.weather[0].icon;
                const imageUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

                res.write("<p>The weather in " + query + " is " + weatherDescription + " today.</p>");
                res.write("<h1>The temperature is " + temperature + " degrees Celsius.</h1>");
                res.write("<img src=" + imageUrl + ">");
                res.end();
            } else {
                res.send("Error: Could not retrieve weather data.");
            }
        });
    });
});

app.listen(3000, function() {
    console.log("SERVER HAS STARTED AT PORT 3000");
});

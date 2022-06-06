const getDestinations = require("./routes/destination/get");
const express = require("express");
const init = require("./initServices");
const dotenv = require("dotenv").config();

// Set up the configuration
const config = {
    geonames_username: process.env.GEONAMES_USERNAME,
    pixabay_api_key: process.env.PIXABAY_API_KEY,
    weatherbit_api_key: process.env.WEATHERBIT_API_KEY,
};

const app = express();

app.use(express.static("dist"));

/* Middleware*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

console.log(__dirname);

// Serve the frontend page
app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

// Fetch destinations
app.post("/destinations", async function (request, response) {
    const destinations = await getDestinations.get(request.body);
    response.send(destinations);
});

// Initialize all the services
init.initServices(config);

const port = process.env.PORT || 3000;

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
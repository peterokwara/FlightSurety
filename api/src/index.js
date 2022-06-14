const express = require("express");
const init = require("./initServices");
const ServiceFactory = require("./factories/serviceFactory");
const getOracle = require("./routes/oracle/get");

const app = express();

/* Middleware*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

async function run() {

    // Initialize all the services
    init.initServices();

    // Get an instance of the ethereum service and oracle service
    const ethereumService = ServiceFactory.get("ethereum-service");
    const oracleService = ServiceFactory.get("oracle-service");

    // Initialize web3
    await ethereumService.initWeb3();

    // Register all 20 oracles
    await oracleService.registerOracles();

    // Get the indexes of the registered oracles and store them
    await oracleService.getOracleIndexes();

    // // Listen to the oracle request event
    // await oracleService.oracleRequest();

    // // Submit the oracle response
    // await oracleService.submitResponse()

}

// Monitor 
app.post("/flightStatus", async function (request, response) {
    await getOracle.get(request.body);
});


const port = process.env.PORT || 4000;

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});

run();
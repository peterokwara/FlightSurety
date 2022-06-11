const ServiceFactory = require("../../factories/serviceFactory");

/**
 * Get destinations
 * @param  request the request
 * @returns the response
 */
async function get() {
    const oracleService = ServiceFactory.get("oracle-service");
    const ethereumService = ServiceFactory.get("ethereum-service");

    // Do a fetch flight status (test)
    await ethereumService.fetchFlightStatus();

    // Listen to the oracle request event
    await oracleService.oracleRequest();

    // Submit the oracle response
    await oracleService.submitResponse();
    console.log("endpoint called")
}

module.exports = { get };

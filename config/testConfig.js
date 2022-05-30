const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");


const config = async (accounts) => {
    let owner = accounts[0];
    let firstAirlineAddress = accounts[1];
    let firstAirlineName = "Kenya Airways";
    
    let flightSuretyData = await FlightSuretyData.new(firstAirlineName, firstAirlineAddress);
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

    return {
        owner: owner,
        firstAirlineName: firstAirlineName,
        firstAirlineAddress: firstAirlineAddress,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }

}

module.exports = {
    config: config
}
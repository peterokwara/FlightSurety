// migrating the appropriate contracts
const FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
const FlightSuretyData = artifacts.require("./FlightSuretyData.sol");


module.exports = async (deployer, network, accounts) => {

    // Add the first airline
    let firstAirlineName = "Kenya Airways";
    let firstAirlineAddress = accounts[1];

    // Deploy the contracts
    await deployer.deploy(FlightSuretyData, firstAirlineName, firstAirlineAddress);
    await deployer.deploy(FlightSuretyApp, FlightSuretyData.address);
};
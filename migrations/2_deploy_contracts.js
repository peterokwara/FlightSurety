// migrating the appropriate contracts
const FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
const FlightSuretyData = artifacts.require("./FlightSuretyData.sol");
const fs = require('fs');

module.exports = async (deployer, network, accounts) => {

    // Add the first airline
    let firstAirlineName = "Kenya Airways";
    let firstAirlineAddress = accounts[1];

    // Deploy the contracts
    await deployer.deploy(FlightSuretyData, firstAirlineName, firstAirlineAddress);
    await deployer.deploy(FlightSuretyApp, FlightSuretyData.address);

    let config = {
        url: 'http://localhost:8545',
        dataAddress: FlightSuretyData.address,
        appAddress: FlightSuretyApp.address
    }

    fs.writeFileSync(__dirname + '/../api/src/data/config.local.json', JSON.stringify(config, null, '\t'), 'utf-8');

};
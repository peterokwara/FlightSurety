// migrating the appropriate contracts
const FlightSuretyApp = artifacts.require("./FlightSuretyApp.sol");
const FlightSuretyData = artifacts.require("./FlightSuretyData.sol");


module.exports = function (deployer) {
    deployer.deploy(FlightSuretyApp);
    deployer.deploy(FlightSuretyData);
};
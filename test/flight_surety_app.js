const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSuretyApp", async (accounts) => {

  let owner = accounts[0];
  let firstAirlineAddress = accounts[1];
  let firstAirlineName = "Kenya Airways";


  let flightSuretyData = await FlightSuretyData.new(firstAirlineName, firstAirlineAddress);
  let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

  describe('(airline)', () => {

    it('should register the first airline when the contract is deployed', async () => {
      let airlineName = await flightSuretyData.getAirlineName(firstAirlineAddress, { from: owner });
      assert.equal(airlineName, firstAirlineName, "First airline is not registered when contract is deployed")
    });
  });
});

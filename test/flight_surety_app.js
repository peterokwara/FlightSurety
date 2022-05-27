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

  let airline2 = accounts[2];
  let airline3 = accounts[3];
  let airline4 = accounts[4];
  let airline5 = accounts[5];


  let flightSuretyData = await FlightSuretyData.new(firstAirlineName, firstAirlineAddress);
  let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

  describe('(airline)', () => {

    it('should register the first airline when the contract is deployed', async () => {
      let airlineName = await flightSuretyData.getAirlineName(firstAirlineAddress, { from: owner });
      assert.equal(airlineName, firstAirlineName, "First airline is not registered when contract is deployed")
    });

    it('should not register an airline if an airline is not registered', async () => {
      try {
        await flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: firstAirlineAddress });
      } catch (error) {
        console.log(error)
      }

      let result = await flightSuretyData.isAirline.call(airline2);

      assert.equal(result, false, "Airline should not be able to register another airline if it has not provided funding");
    });
  });
});

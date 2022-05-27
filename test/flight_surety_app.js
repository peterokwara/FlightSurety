const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSurety", async (accounts) => {

  let owner = accounts[0];
  let firstAirlineAddress = accounts[1];
  let firstAirlineName = "Kenya Airways";

  let airline2 = accounts[2];
  let airline3 = accounts[3];
  let airline4 = accounts[4];
  let airline5 = accounts[5];

  const AIRLINE_FUNDING_VALUE = web3.utils.toWei("10", "ether");

  let flightSuretyData = await FlightSuretyData.new(firstAirlineName, firstAirlineAddress);
  let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

  describe('(airline)', () => {

    before('setup contract', async () => {
      await flightSuretyData.authorizeCaller(flightSuretyApp.address);
    });

    it('should register the first airline when the contract is deployed', async () => {
      let airlineName = await flightSuretyData.getAirlineName(firstAirlineAddress, { from: owner });
      assert.equal(airlineName, firstAirlineName, "First airline is not registered when contract is deployed")
    });

    it('should not register an airline if an airline is not registered', async () => {
      try {
        await flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: firstAirlineAddress });
      } catch (error) { }

      let result = await flightSuretyData.isAirline.call(airline2);

      assert.equal(result, false, "Airline should not be able to register another airline if it has not provided funding");
    });

    it('should have a funding of 10 ether', async () => {
      const AIRLINE_FUNDING_VALUE_LOWER = web3.utils.toWei("5", "ether");

      let reverted = false;
      try {
        await flightSuretyApp.fundAirline({ from: firstAirlineAddress, value: AIRLINE_FUNDING_VALUE_LOWER })
      }
      catch (error) {
        reverted = true;
      }

      assert.equal(reverted, true, "Airline cannot be funded with less than 10 ether");

    });

    it('should participate in contract when it is funded with the correct amount', async () => {
      await flightSuretyApp.fundAirline({ from: firstAirlineAddress, value: AIRLINE_FUNDING_VALUE })

      try {
        await flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: firstAirlineAddress });
      }
      catch (e) {
        console.log(e);
      }
      let result = await flightSuretyData.isAirline.call(airline2);

      assert.equal(result, true, "Airline should be able to register another airline if it has been funded");
    });

  });
});

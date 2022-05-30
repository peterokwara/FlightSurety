const test = require('../config/testConfig');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSurety App", async (accounts) => {
  let config;

  let airline2 = accounts[2];
  let airline3 = accounts[3];
  let airline4 = accounts[4];
  let airline5 = accounts[5];

  const AIRLINE_FUNDING_VALUE = web3.utils.toWei("10", "ether");

  before('setup contract', async () => {
    config = await test.config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  describe('The (airline)', () => {

    it('should register the first airline when the contract is deployed', async () => {
      let airlineName = await config.flightSuretyData.getAirlineName(config.firstAirlineAddress, { from: config.owner });
      assert.equal(airlineName, config.firstAirlineName, "First airline is not registered when contract is deployed")
    });

    it('should not register an airline if an airline is not registered', async () => {
      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      } catch (error) { }

      let result = await config.flightSuretyData.isAirline.call(airline2);

      assert.equal(result, false, "Airline should not be able to register another airline if it has not provided funding");
    });

    it('should have a funding of 10 ether', async () => {
      const AIRLINE_FUNDING_VALUE_LOWER = web3.utils.toWei("5", "ether");

      let reverted = false;
      try {
        await config.flightSuretyApp.fundAirline({ from: config.firstAirlineAddress, value: AIRLINE_FUNDING_VALUE_LOWER })
      }
      catch (error) {
        reverted = true;
      }

      assert.equal(reverted, true, "Airline cannot be funded with less than 10 ether");

    });

    it('should participate in contract when it is funded with the correct amount', async () => {
      await config.flightSuretyApp.fundAirline({ from: config.firstAirlineAddress, value: AIRLINE_FUNDING_VALUE })

      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      }
      catch (e) {
        console.log(e);
      }
      let result = await config.flightSuretyData.isAirline.call(airline2);

      assert.equal(result, true, "Airline should be able to register another airline if it has been funded");
    });

    it('should not register a contract more than twice', async () => {
      let reverted = false;

      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      } catch (error) {
        reverted = true;
      }
      assert.equal(reverted, true, "Airline cannot be registered twice")
    });

  });
});

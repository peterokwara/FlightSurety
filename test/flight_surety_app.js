const test = require('../config/testConfig');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSurety App", async (accounts) => {
  let config;

  const TIMESTAMP = Math.floor(Date.now() / 1000);


  let airline2 = accounts[2];
  let airline3 = accounts[3];
  let airline4 = accounts[4];
  let airline5 = accounts[5];

  let flight1 = {
    airline: airline2,
    flight: "5J 814",
    from: "SIN",
    to: "MNL",
    timestamp: TIMESTAMP
  }
  let flight2 = {
    airline: airline2,
    flight: "5J 600",
    from: "CEB",
    to: "DVO",
    timestamp: TIMESTAMP
  }
  let flight3 = {
    airline: airline3,
    flight: "PR 2543",
    from: "MNL",
    to: "DGT",
    timestamp: TIMESTAMP
  }
  let flight4 = {
    airline: airline4,
    flight: "SQ 345",
    from: "ZRH",
    to: "SIN",
    timestamp: TIMESTAMP
  }

  const AIRLINE_FUNDING_VALUE = web3.utils.toWei("10", "ether");

  before('setup contract', async () => {
    config = await test.config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  describe('The (airline)', () => {

    it('should register the first airline when the contract is deployed', async () => {

      // Check if the first airline has been registered
      let airlineName = await config.flightSuretyData.getAirlineName(config.firstAirlineAddress, { from: config.owner });
      assert.equal(airlineName, config.firstAirlineName, "First airline is not registered when contract is deployed")
    });

    it('should not register an airline if an airline is not registered', async () => {

      // Register a second airline without funding
      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      } catch (error) { }

      // Should fail to register an airline since funding has not been provided
      let result = await config.flightSuretyData.isAirline.call(airline2);
      assert.equal(result, false, "Airline should not be able to register another airline if it has not provided funding");
    });

    it('should have a funding of 10 ether', async () => {
      const AIRLINE_FUNDING_VALUE_LOWER = web3.utils.toWei("5", "ether");

      let reverted = false;

      // Fund the airline with less amount
      try {
        await config.flightSuretyApp.fundAirline({ from: config.firstAirlineAddress, value: AIRLINE_FUNDING_VALUE_LOWER })
      }
      catch (error) {
        reverted = true;
      }

      // Should fail to fund the airline, since the amount is not enough
      assert.equal(reverted, true, "Airline cannot be funded with less than 10 ether");

    });

    it('should participate in contract when it is funded with the correct amount', async () => {

      // Fund the first airline
      await config.flightSuretyApp.fundAirline({ from: config.firstAirlineAddress, value: AIRLINE_FUNDING_VALUE })

      // Try to register the second airline
      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      }
      catch (e) {
        console.log(e);
      }

      // The second airline should be registered
      let result = await config.flightSuretyData.isAirline.call(airline2);
      assert.equal(result, true, "Airline should be able to register another airline if it has been funded");
    });

    it('should not register an airline more than twice', async () => {
      let reverted = false;

      // Try and register an airline that has already been registered
      try {
        await config.flightSuretyApp.registerAirline("Ugandan Airways", airline2, { from: config.firstAirlineAddress });
      } catch (error) {
        reverted = true;
      }

      // Registering the airline should be unsuccessful
      assert.equal(reverted, true, "Airline cannot be registered twice")
    });

    it('should be able to register more than 4 airlines', async () => {
      let result;

      // Register the third airline
      try {
        await config.flightSuretyApp.registerAirline("South African Airways", airline3, { from: config.firstAirlineAddress });
      } catch (error) {
        console.log(error)
      }

      result = await config.flightSuretyData.isAirline.call(airline3);
      assert.equal(result, true, "Registering the third airline should be possible");

      // Register the fourth airline
      try {
        await config.flightSuretyApp.registerAirline("Rwanda air", airline4, { from: config.firstAirlineAddress });
      }
      catch (e) {
        console.log(e);
      }

      // Registering the fourth airline should be successful
      result = await config.flightSuretyData.isAirline.call(airline4);
      assert.equal(result, true, "Registering the fourth airline should be possible");

    });

    it('should not be able to register the 5th airline on its own', async () => {
      let result;

      // Register the fifth airline
      try {
        await config.flightSuretyApp.registerAirline("Air Tanzania", airline5, { from: config.firstAirlineAddress });
      }
      catch (e) {
        console.log(e);
      }

      result = await config.flightSuretyData.isAirline.call(airline5);

      // Registering the fifth airline should fail
      assert.equal(result, false, "Registering the fifth airline should not be possible");
    });

    it('should register the 5th airline if multi-party consensus of 50% of registered airlines is there', async () => {
      let result = undefined;

      // Fund the second airline
      await config.flightSuretyApp.fundAirline({ from: airline2, value: AIRLINE_FUNDING_VALUE });

      // Try to register the fifth airline again
      try {
        await config.flightSuretyApp.registerAirline("Air Tanzania", airline5, { from: airline2 });
      }
      catch (e) {
        console.log(e);
      }

      // Registering the fifth airline should be successfull
      result = await config.flightSuretyData.isAirline.call(airline5);
      assert.equal(result, true, "Registering the fifth airline should be possible");
    });

    it('should be able to register a new flight', async () => {

      let result;

      // Register a flight
      try {
        await config
          .flightSuretyApp
          .registerFlight(flight1.flight, flight1.to, flight1.from, flight1.timestamp, { from: flight1.airline });
      } catch (error) {
        console.log(error);
      }

      // Check if the flight is registered
      result = await config.flightSuretyData.isFlight.call(flight1.airline, flight1.flight, flight1.timestamp);
      assert.equal(result, true, "A funded airline can register a new flight");

    });

    it('should fail to register the flight more than once', async () => {

      let reverted = false;

      // Register the flight again
      try {
        await config
          .flightSuretyApp
          .registerFlight(flight1.flight, flight1.to, flight1.from, flight1.timestamp, { from: flight1.airline });
      } catch (error) {
        reverted = true;
      }

      assert.equal(reverted, true, "Airline cannot register a flight more than once")
    });


    it('should not register a flight if the airline is not funded', async () => {
      let reverted = false;

      // Register from a non funded airline
      try {
        await config
          .flightSuretyApp
          .registerFlight(flight3.flight, flight3.to, flight3.from, flight3.timestamp, { from: flight3.airline });
      }
      catch (e) {
        reverted = true;
      }

      // Should be reverted
      assert.equal(reverted, true, "Airline cannot register a flight if it is not funded");
    });
  });

  describe('The (passenger)', () => {
    it('should not be able to buy insurance from a non-registered flight', async () => {
      let reverted = false;

      // Buy insurance from a non registered flight
      try {
        await config
          .flightSuretyApp
          .buyInsurance(flight3.airline, flight3.flight, flight3.timestamp, { from: passenger1, value: PASSENGER_INSURANCE_VALUE })
      } catch (error) {
        reverted = true;
      }

      assert.equal(reverted, true, "The flight is not registered")
    });

    it('should not be able to buy insurance for the same flight that has been insured', async () => {
      let reverted = false;

      // Buy insurance from a non registered flight
      try {
        await config
          .flightSuretyApp
          .buyInsurance(flight3.airline, flight3.flight, flight3.timestamp, { from: passenger1, value: PASSENGER_INSURANCE_VALUE })
      } catch (error) {
        reverted = true;
      }

      assert.equal(reverted, true, "Passenger cannot buy insurance for the flight twice")
    });
  });

});



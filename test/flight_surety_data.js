const test = require('../config/testConfig');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSuretyData", function (accounts) {

  before('setup contract', async () => {
    config = await test.config(accounts);
  });

  describe('The (operation)', () => {
    it("should have the correct initial isOperational() value", async function () {

      // Check if the flightsurety Data Contract is operational
      let status = await config.flightSuretyData.isOperational.call();
      assert.equal(status, true, "Incorrect initial operating status value");
    });

    it('should block access to setOperatingStatus() for non-contract owner account', async () => {

      let accessDenied = false;

      // Change the status of the Flight Surety Data Contract from a non contract account
      try {
        await config.flightSuretyData.setOperatingStatus(false, { from: accounts[2] });
      } catch (error) {
        accessDenied = true;
      }

      // Access should be restricted if it's from a non contract account
      assert.equal(accessDenied, true, "Access has not been restricted by the contract owner");
    });

    it('should allow access to setOperatingStatus() for contract owner account', async () => {
      let accessDenied = false;

      // Change the status of the Flight Surety Data contract from owner account
      try {
        await config.flightSuretyData.setOperatingStatus(false, { from: accounts[0] });
      } catch (error) {
        console.log(error);
        accessDenied = true;
      }

      // Setting the operating status should not be restricted
      assert.equal(accessDenied, false, "Access has not been restricted by the contract owner");
    });
  });

});

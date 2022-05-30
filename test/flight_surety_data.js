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

  describe('operation', () => {
    it("should have the correct initial isOperational() value", async function () {
      let status = await config.flightSuretyData.isOperational.call();
      assert.equal(status, true, "Incorrect initial operating status value");
    });

    it('should block access to setOperatingStatus() for non-contract owner account', async () => {
      let accessDenied = false;
      try {
        await config.flightSuretyData.setOperatingStatus(false, { from: accounts[2] });
      } catch (error) {
        accessDenied = true;
      }

      assert.equal(accessDenied, true, "Access has not been restricted by the contract owner");
    });

    it('should allow access to setOperatingStatus() for contract owner account', async () => {
      let accessDenied = false;
      try {
        await config.flightSuretyData.setOperatingStatus(false, { from: accounts[0] });
      } catch (error) {
        console.log(error);
        accessDenied = true;
      }

      assert.equal(accessDenied, false, "Access has not been restricted by the contract owner");
    });
  });

});

const FlightSuretyApp = artifacts.require("FlightSuretyApp");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSuretyApp", function (accounts) {
  it("should assert true", async function () {
    await FlightSuretyApp.deployed();
    return assert.isTrue(true);
  });
});

const FlightSuretyData = artifacts.require("FlightSuretyData");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FlightSuretyData", function (accounts) {

  it("should have the correct initial isOperational() value", async function () {
    const flightSuretyData = await FlightSuretyData.deployed();
    let status = await flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");
  });

});

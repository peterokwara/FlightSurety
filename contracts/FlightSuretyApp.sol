// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract FlightSuretyApp {
    // FlightSurety data contract
    FlightSuretyData flightSuretyData;

    // Account used to deploy contract
    address private contractOwner;

    constructor(address dataContract) public {
        contractOwner = msg.sender;
        flightSuretyData = FlightSuretyData(dataContract);
    }
}

// FlightSurety data contract interface
contract FlightSuretyData {

}

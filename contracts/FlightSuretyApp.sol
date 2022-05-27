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

    // Modifiers //

    /**
     * @dev Modifer that requires the "operational" boolean variable to be "true"
     */
    modifier requireIsOperational() {
        // Modify to call data contract's status
        require(
            flightSuretyData.isOperational(),
            "Contract is currently not operational"
        );
        _;
    }

    /**
     * @dev Modifier that requires address to be valid
     */
    modifier requireValidAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    /**
     * @dev Modifier that requires airline to be funded
     */
    modifier requireAirlineIsFunded(address airline) {
        require(
            flightSuretyData.isFundedAirline(airline),
            "Only existing and funded airlines are allowed"
        );
        _;
    }

    // Smart Contract Functions //
    function registerAirline(string memory name, address addr)
        public
        requireIsOperational
        requireValidAddress(addr)
        requireAirlineIsFunded(msg.sender)
    {}
}

// FlightSurety data contract interface
abstract contract FlightSuretyData {
    // Utility functions
    function isOperational() public view virtual returns (bool);

    function setOperatingStatus(bool mode) external virtual;

    // Airlines
    function registerAirline(string calldata name, address addr)
        external
        virtual
        returns (bool);

    function isFundedAirline(address airline)
        external
        view
        virtual
        returns (bool);
}

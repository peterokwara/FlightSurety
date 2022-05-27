// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract FlightSuretyApp {
    // Data Variables //

    // FlightSurety data contract
    FlightSuretyData flightSuretyData;

    // Account used to deploy contract
    address private contractOwner;

    // Airline
    uint256 constant AIRLINE_FUNDING_VALUE = 10 ether;

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

    // Events //
    event AirlineFunded(address addr, uint256 amount);

    // Smart Contract Functions //
    function registerAirline(string memory name, address addr)
        public
        requireIsOperational
        requireValidAddress(addr)
        requireAirlineIsFunded(msg.sender)
    {}

    /**
     * @dev Submit funding for airline
     */
    function fundAirline() external payable requireIsOperational {
        require(
            msg.value == AIRLINE_FUNDING_VALUE,
            "Not correct funding value submitted"
        );

        // Cast address to payable address
        payable(address(flightSuretyData)).transfer(msg.value);
            // address(uint160(passenger)).transfer(amount);

        flightSuretyData.fundAirline(msg.sender);

        emit AirlineFunded(msg.sender, msg.value);
    }
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

    function fundAirline(address addr) external payable virtual;
}

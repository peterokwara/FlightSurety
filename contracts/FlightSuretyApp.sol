// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

// import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract FlightSuretyApp {
    // Data Variables //

    // FlightSurety data contract
    FlightSuretyData flightSuretyData;

    // Account used to deploy contract
    address private contractOwner;

    // Airline
    uint256 constant AIRLINE_FUNDING_VALUE = 10 ether;

    // Multi-party consensus for airline registration
    mapping(address => address[]) private registerAirlineMultiCalls;

    // Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines
    uint256 constant REGISTER_AIRLINE_MULTI_CALL_THRESHOLD = 4;

    uint256 constant REGISTER_AIRLINE_MULTI_CALL_CONSENSUS_DIVISOR = 2;

    // Constructor //

    constructor(address dataContract) {
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
    event AirlineRegistered(
        string name,
        address addr,
        bool success,
        uint256 votes
    );

    // Smart Contract Functions //

    /**
     * @dev Add an airline to the registration queue
     */
    function registerAirline(string calldata name, address addr)
        public
        requireIsOperational
        requireValidAddress(addr)
        requireAirlineIsFunded(msg.sender)
        returns (bool success, uint256 votes)
    {
        bool result = false;
        address[] memory registeredAirlines = flightSuretyData
            .getRegisteredAirlines();

        // Register first airline
        if (registeredAirlines.length == 0) {
            result = flightSuretyData.registerAirline(name, addr);
        } else if (
            registeredAirlines.length < REGISTER_AIRLINE_MULTI_CALL_THRESHOLD
        ) {
            result = flightSuretyData.registerAirline(name, addr);
        }
        // Multiparty Consensus: Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines
        else {
            bool isDuplicate = false;

            for (
                uint256 i = 0;
                i < registerAirlineMultiCalls[addr].length;
                i++
            ) {
                if (registerAirlineMultiCalls[addr][i] == msg.sender) {
                    isDuplicate = true;
                    break;
                }
            }

            require(!isDuplicate, "Caller has already called this function.");

            registerAirlineMultiCalls[addr].push(msg.sender);

            if (
                registerAirlineMultiCalls[addr].length >=
                registeredAirlines.length /
                    REGISTER_AIRLINE_MULTI_CALL_CONSENSUS_DIVISOR
            ) {
                result = flightSuretyData.registerAirline(name, addr);
                registerAirlineMultiCalls[addr] = new address[](0);
            }
        }

        emit AirlineRegistered(
            name,
            addr,
            result,
            registerAirlineMultiCalls[addr].length
        );
        return (result, registerAirlineMultiCalls[addr].length);
    }

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

    function getRegisteredAirlines()
        external
        view
        virtual
        returns (address[] memory);
}

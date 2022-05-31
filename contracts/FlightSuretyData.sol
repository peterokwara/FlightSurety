// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract FlightSuretyData {
    // Data Variables //

    address private contractOwner;
    bool private operational = true;

    uint256 constant M = 1;
    address[] multiCalls = new address[](0);

    // Restrict data contract callers
    mapping(address => uint256) private authorizedContracts;

    // Airlines
    struct Airline {
        string name;
        bool isRegistered;
        bool isFunded;
    }

    mapping(address => Airline) private airlines;
    address[] registeredAirlines = new address[](0);

    // Flights
    struct Flight {
        bool isRegistered;
        uint8 statusCode; // 0: unknown (in-flight), >0: landed
        uint256 updatedTimestamp;
        address airline;
        string flight;
        string from;
        string to;
    }
    mapping(bytes32 => Flight) private flights;
    bytes32[] registeredFlights = new bytes32[](0);

    // Funding
    struct Fund {
        uint256 amount;
    }

    mapping(address => Fund) fund;

    // Modifier //

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     */
    modifier requireIsOperational() {
        require(isOperational(), "Contract is currently not operational");
        _;
    }

    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
     * @dev Modifier that requires function caller to be authorized
     */
    modifier requireIsCallerAuthorized() {
        require(
            authorizedContracts[msg.sender] == 1,
            "Caller is not authorized"
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
            this.isFundedAirline(airline),
            "Only existing and funded airlines are allowed"
        );
        _;
    }

    // Utility Functions //

    /**
     * @dev Get the operating status of a contract
     * @return boolean A value that states if the contract is operational or not
     */
    function isOperational() public view returns (bool) {
        return operational;
    }

    /**
     * @dev Set the operating status of the contract
     */
    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    /**
     * @dev Get airline details
     * @return Airline with the provided address
     */
    function getAirlineName(address airline)
        external
        view
        returns (string memory)
    {
        return airlines[airline].name;
    }

    /**
     * @dev Check if the address is a registered airline
     * @return A bool confirming whether or not the address is a registered airline
     */
    function isAirline(address airline) external view returns (bool) {
        return airlines[airline].isRegistered;
    }

    /**
     * @dev Check if the address is a funded airline
     * @return A bool confirming whether or not the address is a funded airline
     */
    function isFundedAirline(address airline) external view returns (bool) {
        return airlines[airline].isFunded;
    }

    /**
     * @dev Get registered airlines
     * @return array with the addresses of all registered airlines
     */
    function getRegisteredAirlines() external view returns (address[] memory) {
        return registeredAirlines;
    }

    /**
     * @dev Adds address to authorized contracts
     */
    function authorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        authorizedContracts[contractAddress] = 1;
    }

    /**
     * @dev Removes address from authorized contracts
     */
    function deauthorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        delete authorizedContracts[contractAddress];
    }

    /**
     * @dev Get the flight key given the airline, flight and timestamp
     * @return key The key for the flight
     */
    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Check if the flight is registered
     */
    function isFlight(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view returns (bool) {
        return flights[getFlightKey(airline, flight, timestamp)].isRegistered;
    }

    // Event Definitions //

    event AirlineFunded(string name, address addr);
    event AirlineRegistered(string name, address addr);
    event FlightRegistered(
        bytes32 flightKey,
        address airline,
        string flight,
        string from,
        string to,
        uint256 timestamp
    );

    constructor(string memory firstAirlineName, address firstAirlineAddress) {
        contractOwner = msg.sender;

        // Airline contract initialization
        airlines[firstAirlineAddress] = Airline({
            name: firstAirlineName,
            isRegistered: true,
            isFunded: false
        });

        registeredAirlines.push(firstAirlineAddress);
    }

    // Smart Contract Functions //

    /**
     * @dev Submit funding for airline
     */
    function fundAirline(address addr)
        external
        requireIsOperational
        requireIsCallerAuthorized
    {
        airlines[addr].isFunded = true;
        emit AirlineFunded(airlines[addr].name, addr);
    }

    /**
     * @dev Add an airline to the registration queue
     */
    function registerAirline(string calldata name, address addr)
        external
        requireIsOperational
        requireIsCallerAuthorized
        requireValidAddress(addr)
        returns (bool success)
    {
        require(
            !airlines[addr].isRegistered,
            "Airline has already been registered"
        );

        bool result = true;

        airlines[addr] = Airline({
            name: name,
            isFunded: false,
            isRegistered: true
        });

        registeredAirlines.push(addr);

        emit AirlineRegistered(name, addr);

        return result;
    }

    /**
     * @dev Register a flight
     */
    function registerFlight(
        address airline,
        string calldata flight,
        string calldata from,
        string calldata to,
        uint256 timestamp
    )
        external
        requireIsOperational
        requireIsCallerAuthorized
        requireValidAddress(airline)
        requireAirlineIsFunded(airline)
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(
            !flights[flightKey].isRegistered,
            "Flight has already been registered"
        );

        flights[flightKey] = Flight({
            isRegistered: true,
            statusCode: 0,
            updatedTimestamp: timestamp,
            airline: airline,
            flight: flight,
            from: from,
            to: to
        });

        registeredFlights.push(flightKey);

        emit FlightRegistered(flightKey, airline, flight, from, to, timestamp);
    }

    /**
     * @dev Fallback function for funding smart contract.
     */
    fallback() external payable {}

    receive() external payable {}
}

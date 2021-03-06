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

    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    // Insurance
    struct Insurance {
        address passenger;
        uint256 amount; // Passenger insurance payment
        uint256 multiplier; // General damages multiplier (1.5x by default)
        bool isCredited;
    }
    mapping(bytes32 => Insurance[]) insuredPassengersPerFlight;
    mapping(address => uint256) public pendingPayments;

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

    /**
     * @dev Check if the flight status code is "landed"
     */
    function isLandedFlight(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view returns (bool) {
        return
            flights[getFlightKey(airline, flight, timestamp)].statusCode >
            STATUS_CODE_UNKNOWN;
    }

    /**
     * @dev Check if the passenger is registerd for the flight
     */
    function isInsured(
        address passenger,
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view returns (bool) {
        Insurance[] memory insuredPassengers = insuredPassengersPerFlight[
            getFlightKey(airline, flight, timestamp)
        ];
        for (uint256 i = 0; i < insuredPassengers.length; i++) {
            if (insuredPassengers[i].passenger == passenger) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Check if the flight is registered
     */
    function getFlightStatusCode(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view returns (uint8) {
        return flights[getFlightKey(airline, flight, timestamp)].statusCode;
    }

    /**
     * @dev Return the pending payment
     */
    function getPendingPaymentAmount(address passenger)
        external
        view
        returns (uint256)
    {
        return pendingPayments[passenger];
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
    event InsuranceBought(
        address airline,
        string flight,
        uint256 timestamp,
        address passenger,
        uint256 amount,
        uint256 multiplier
    );
    event FlightStatusUpdated(
        address airline,
        string flight,
        uint256 timestamp,
        uint8 statusCode
    );
    event InsureeCredited(address passenger, uint256 amount);
    event AccountWithdrawn(address passenger, uint256 amount);

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
     * @dev Buy insurance for a flight
     */
    function buy(
        address airline,
        string calldata flight,
        uint256 timestamp,
        address passenger,
        uint256 amount,
        uint256 multiplier
    ) external requireIsOperational requireIsCallerAuthorized {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);

        insuredPassengersPerFlight[flightKey].push(
            Insurance({
                passenger: passenger,
                amount: amount,
                multiplier: multiplier,
                isCredited: false
            })
        );

        emit InsuranceBought(
            airline,
            flight,
            timestamp,
            passenger,
            amount,
            multiplier
        );
    }

    /**
     * @dev Process flights
     */
    function processFlightStatus(
        address airline,
        string calldata flight,
        uint256 timestamp,
        uint8 statusCode
    ) external requireIsOperational requireIsCallerAuthorized {
        //require(!this.isLandedFlight(airline, flight, timestamp), "Flight already landed");

        bytes32 flightKey = getFlightKey(airline, flight, timestamp);

        if (flights[flightKey].statusCode == STATUS_CODE_UNKNOWN) {
            flights[flightKey].statusCode = statusCode;
            if (statusCode == STATUS_CODE_LATE_AIRLINE) {
                creditInsurees(airline, flight, timestamp);
            }
        }

        emit FlightStatusUpdated(airline, flight, timestamp, statusCode);
    }

    /**
     * @dev Credits payouts to insurees
     */
    function creditInsurees(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal requireIsOperational requireIsCallerAuthorized {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);

        for (
            uint256 i = 0;
            i < insuredPassengersPerFlight[flightKey].length;
            i++
        ) {
            Insurance memory insurance = insuredPassengersPerFlight[flightKey][
                i
            ];

            if (insurance.isCredited == false) {
                insurance.isCredited = true;
                uint256 amount = (insurance.amount * insurance.multiplier) /
                    100;
                pendingPayments[insurance.passenger] += amount;

                emit InsureeCredited(insurance.passenger, amount);
            }
        }
    }

    /**
     * @dev Transfers eligible payout funds to insuree
     */
    function pay(address passenger)
        external
        requireIsOperational
        requireIsCallerAuthorized
    {
        // Checks
        require(passenger == tx.origin, "Contracts not allowed");
        require(
            pendingPayments[passenger] > 0,
            "No fund available for withdrawal"
        );

        // Effects
        uint256 amount = pendingPayments[passenger];
        pendingPayments[passenger] = 0;

        // Cast address to payable address
        payable(address(passenger)).transfer(amount);

        emit AccountWithdrawn(passenger, amount);
    }

    /**
     * @dev Fallback function for funding smart contract.
     */
    fallback() external payable {}

    receive() external payable {}
}

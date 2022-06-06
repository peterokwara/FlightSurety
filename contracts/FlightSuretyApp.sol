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

    // Insurance

    // Passenger Payment: Passengers may pay up to 1 ether for purchasing flight insurance
    uint256 constant MAX_PASSENGER_INSURANCE_VALUE = 1 ether;

    // Insurance multiplier in percentage
    uint256 constant INSURANCE_MULTIPLIER = 150; // 150%

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
    event FlightRegistered(
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

    /**
     * @dev Register a flight
     */
    function registerFlight(
        string calldata flight,
        string calldata from,
        string calldata to,
        uint256 timestamp
    )
        external
        requireIsOperational
        requireValidAddress(msg.sender)
        requireAirlineIsFunded(msg.sender)
    {
        // Register Flight
        flightSuretyData.registerFlight(
            msg.sender,
            flight,
            from,
            to,
            timestamp
        );
        emit FlightRegistered(msg.sender, flight, from, to, timestamp);
    }

    /**
     * @dev Buy insurance for a flight
     */
    function buyInsurance(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external payable requireIsOperational {
        require(
            msg.value > 0 && msg.value <= MAX_PASSENGER_INSURANCE_VALUE,
            "Insurance value is not within the limits"
        );
        require(
            flightSuretyData.isFlight(airline, flight, timestamp),
            "Flight is not registered"
        );
        require(
            !flightSuretyData.isLandedFlight(airline, flight, timestamp),
            "Flight already landed"
        );
        require(
            !flightSuretyData.isInsured(msg.sender, airline, flight, timestamp),
            "Passenger already bought insurance for this flight"
        );

        // Cast address to payable address
        payable(address(flightSuretyData)).transfer(msg.value);

        // Store airline information
        flightSuretyData.buy(
            airline,
            flight,
            timestamp,
            msg.sender,
            msg.value,
            INSURANCE_MULTIPLIER
        );

        emit InsuranceBought(
            airline,
            flight,
            timestamp,
            msg.sender,
            msg.value,
            INSURANCE_MULTIPLIER
        );
    }

    /// Oracle Management ///

    // Data Variables //

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;

    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester; // Account that requested status
        bool isOpen; // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses; // Mapping key is the status code reported
        // This lets us group responses and identify
        // the response that majority of the oracles
    }

    mapping(uint256 => ResponseInfo) oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(
        address airline,
        string flight,
        uint256 timestamp,
        uint8 status
    );

    event OracleReport(
        address airline,
        string flight,
        uint256 timestamp,
        uint8 status
    );

    /**
     * @dev Event fired when flight status request is submitted
     * Oracles track this and if they have a matching index they
     * fetch data and submit a response
     */
    event OracleRequest(
        uint8 index,
        address airline,
        string flight,
        uint256 timestamp
    );

    /**
     * @dev Register an oracle
     */
    function registerOracle() external payable requireIsOperational {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({isRegistered: true, indexes: indexes});
    }

    /**
     * @dev Get the indexes from a registered oracle
     */
    function getMyIndexes()
        external
        view
        requireIsOperational
        returns (uint8[3] memory)
    {
        require(
            oracles[msg.sender].isRegistered,
            "Not registered as an oracle"
        );

        return oracles[msg.sender].indexes;
    }

    /**
     * @dev Called by the oracle when a response is available to an outstanding request
     * For the response to be accepted, there must be a pending request that is open
     * and matches one of the three Indexes randomly assigned to the oracle at the time
     * of registration. Uninvited oracles are not welcome
     */
    function submitOracleResponse(
        uint8 index,
        address airline,
        string calldata flight,
        uint256 timestamp,
        uint8 statusCode
    ) external requireIsOperational {
        require(
            (oracles[msg.sender].indexes[0] == index) ||
                (oracles[msg.sender].indexes[1] == index) ||
                (oracles[msg.sender].indexes[2] == index),
            "Index does not match oracle request"
        );

        uint256 key = uint256(
            keccak256(abi.encodePacked(index, airline, flight, timestamp))
        );

        require(
            oracleResponses[key].isOpen,
            "Flight or timestamp do not match oracle request"
        );

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);

        emit FlightStatusInfo(airline, flight, timestamp, statusCode);

        if (
            oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES
        ) {
            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }

    /**
     * @dev Get a key associated to a given flight
     */
    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
     * @dev Returns an array of 3 non-duplicating integers from 0 to 9
     */
    function generateIndexes(address account)
        internal
        returns (uint8[3] memory)
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);

        indexes[1] = indexes[0];
        while (indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while ((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    /**
     * @dev Returns an array of 3 non-duplicating integers from 0 to 9
     */
    function getRandomIndex(address account) internal returns (uint8) {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(blockhash(block.number - nonce++), account)
                )
            ) % maxValue
        );

        if (nonce > 250) {
            nonce = 0; // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

    /**
     * @dev Called after oracle has updated flight status
     */
    function processFlightStatus(
        address airline,
        string memory flight,
        uint256 timestamp,
        uint8 statusCode
    ) internal requireIsOperational {
        flightSuretyData.processFlightStatus(
            airline,
            flight,
            timestamp,
            statusCode
        );
    }

    /**
     * @dev Generate a request for oracles to fetch flight information
     */
    function fetchFlightStatus(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        uint256 key = uint256(
            keccak256(abi.encodePacked(index, airline, flight, timestamp))
        );

        ResponseInfo storage r = oracleResponses[key];
        r.requester = msg.sender;
        r.isOpen = true;

        emit OracleRequest(index, airline, flight, timestamp);
    }

    /**
     * @dev Transfers eligible payout funds to insuree
     */
    function pay() public requireIsOperational {
        flightSuretyData.pay(msg.sender);
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

    // Flights
    function registerFlight(
        address airline,
        string calldata flight,
        string calldata from,
        string calldata to,
        uint256 timestamp
    ) external virtual;

    function isFlight(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view virtual returns (bool);

    function isLandedFlight(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view virtual returns (bool);

    function processFlightStatus(
        address airline,
        string calldata flight,
        uint256 timestamp,
        uint8 statusCode
    ) external virtual;

    function getFlightStatusCode(
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view virtual returns (uint8);

    // Insurance
    function isInsured(
        address passenger,
        address airline,
        string calldata flight,
        uint256 timestamp
    ) external view virtual returns (bool);

    // Passengers
    function buy(
        address airline,
        string calldata flight,
        uint256 timestamp,
        address passenger,
        uint256 amount,
        uint256 multiplier
    ) external payable virtual;

    function pay(address passenger) external virtual;
}

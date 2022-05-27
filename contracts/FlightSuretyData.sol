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

    // Event Definitions //
    event AirlineFunded(string name, address addr);

    constructor(string memory firstAirlineName, address firstAirlineAddress)
        public
    {
        contractOwner = msg.sender;

        // Airline contract initialization
        airlines[firstAirlineAddress] = Airline({
            name: firstAirlineName,
            isRegistered: true,
            isFunded: false
        });
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
}

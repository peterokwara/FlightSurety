// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract FlightSuretyData {
    // Data Variables //

    address private contractOwner;
    bool private operational = true;

    // Modifier //

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     */
    modifier requireIsOperational() {
        require(isOperational(), "Contract is currently not operational");
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

    constructor() public {}
}

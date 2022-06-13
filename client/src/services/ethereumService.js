const { ethers } = require("ethers");
const FlightSuretyApp = require('../build/FlightSuretyApp.json');
const FlightSuretyData = require('../build/FlightSuretyData.json');
const config = require("../data/config.local.json");

class EthereumService {
    constructor() {
        this.App = {
            web3Provider: null,
            accounts: [],
            flightSuretyApp: {},
            flightSuretyData: {},
            owner: "0x0000000000000000000000000000000000000000",
            metamaskAccountID: ""
        }
    }

    /**
     * Initialize web3
     */
    async initWeb3() {
        // Find or inject Web3 provider
        if (window.ethereum) {
            // A Web3Provider wraps a standard Web3 provider, which is
            // what Metamask injects as window.ethereum into each page
            this.App.web3Provider = new ethers.providers.Web3Provider(
                window.ethereum
            );
            try {
                // Request account access
                await this.App.web3Provider.send("eth_requestAccounts", []);
            } catch (error) {
                // User denied account access
                console.error("User denied account access");
            }
            // Legacy dapp browsers..
        } else if (window.web3) {
            this.App.web3Provider = window.web3.provider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            this.App.web3Provider = new ethers.providers.JsonRpcProvider(config.url);
        }

        // Get all accounts
        this.App.accounts = await this.App.web3Provider.listAccounts();

        // Set the owner account
        this.App.owner = await this.App.accounts[0];

        // Get the signer
        const signer = await this.App.web3Provider.getSigner();

        // Get an instance of the contract
        this.App.flightSuretyApp = new ethers
            .Contract(config.appAddress, FlightSuretyApp.abi, signer);
        this.App.flightSuretyData = new ethers
            .Contract(config.dataAddress, FlightSuretyData.abi, signer);

    }

    /**
     * Get Metamask Account ID
     */
    async getMetamaskAccountID() {
        // Retrieve accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.App.metamaskAccountID = accounts[0];
    }

    /**
     * Check if the FlightSurety Data Contract is operational
     * @returns Whether the Flight Surety Data contract is operational or not (boolean)
     */
    async isOperational() {
        console.log("Contract", this.App.flightSuretyData)
        // const { isOperational } = this.App.flightSuretyData;
        try {
            const transaction = await this.App.flightSuretyApp.isOperational(config.appAddress, {
                from: this.owner
            })
            return transaction;
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Register an airline
     */
    async registerAirline(airlineName, airlineAddress, registrer) {

        this.getMetamaskAccountID();

        console.log("Error", this.App.metamaskAccountID)

        if (!this.App.metamaskAccountID) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { registerAirline } = contract;

        if (!registerAirline) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        try {
            const transaction = await registerAirline(airlineName, airlineAddress, { from: this.App.metamaskAccountID })
            await transaction.wait();

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.data.message
            }
        }

    }

    /**
     * Fund an airline
     */
    async fundAirline(amount) {

        this.getMetamaskAccountID();

        console.log("Error", this.App.metamaskAccountID)

        if (!this.App.metamaskAccountID) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { fundAirline } = contract;

        try {
            const transaction = await fundAirline({ from: this.App.metamaskAccountID, value: ethers.utils.parseEther(amount) })
            await transaction.wait();

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.data.message
            }
        }

    }



    /**
     * Authorize the caller of a contract
     */
    async authorizeCaller() {

        this.getMetamaskAccountID();

        console.log("Error", this.App.metamaskAccountID)

        if (!this.App.metamaskAccountID) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { authorizeCaller } = contract;

        try {
            const transaction = await authorizeCaller(this.App.metamaskAccountID)
            await transaction.wait();

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                error: error.data.message
            }
        }

    }

    /**
     * Set the operating status of a contract
     */
    async setOperatingStatus(state) {

        this.getMetamaskAccountID();

        if (!this.App.metamaskAccountID) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { setOperatingStatus } = contract;

        try {
            const transaction = await setOperatingStatus(state, { from: this.App.metamaskAccountID })
            await transaction.wait();

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                error: error.data.message
            }
        }

    }
}

module.exports = EthereumService;

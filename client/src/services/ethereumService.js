const { ethers } = require("ethers");
const FlightSuretyApp = require('../build/FlightSuretyApp.json');
const FlightSuretyData = require('../build/FlightSuretyData.json');
const config = require("../data/config.local.json");
const { dateToTimestamp } = require("../utils/dateHandler");

class EthereumService {
    constructor() {
        this.App = {
            web3Provider: null,
            accounts: [],
            flightSuretyApp: {},
            flightSuretyData: {},
            owner: "",
            metamaskAccountID: "",
            timestamp: Date.now()
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

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        const { isOperational } = this.App.flightSuretyData;

        if (!isOperational) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

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
    async registerAirline(airlineName, airlineAddress) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

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

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

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
    * Register a flight
    */
    async registerFlight(flightName, from, to, date) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { registerFlight } = contract;

        const timestamp = dateToTimestamp(date);

        try {
            const transaction = await registerFlight(flightName, from, to, timestamp, { from: this.App.metamaskAccountID })
            await transaction.wait();

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            console.log(error)
            return {
                success: false,
                error: error.data.message
            }
        }

    }


    /**
    * Register a flight
    */
    async isFlight(airline, flight, timestamp) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.owner);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { isFlight } = contract;

        try {
            const transaction = await isFlight(airline, flight, timestamp)
            console.log(airline, flight, timestamp)
            console.log(transaction)

            return {
                success: true,
                error: ""
            }
        }
        catch (error) {
            console.log(error)
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

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.owner);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { authorizeCaller } = contract;

        try {
            const transaction = await authorizeCaller(config.appAddress)
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


        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = await this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = await this.App.flightSuretyData.connect(signer);

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


    /**
     * Set the operating status of a contract
     */
    async buyInsurance(airline, flight, amount, date) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { buyInsurance } = contract;

        const timestamp = dateToTimestamp(date);

        try {
            const transaction = await buyInsurance(airline, flight, timestamp, { value: ethers.utils.parseEther(amount) })
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
     * Fetch the status of a contract
     */
    async fetchFlightStatus(airline, flight, date) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { fetchFlightStatus } = contract;

        const timestamp = dateToTimestamp(date);

        try {
            const transaction = await fetchFlightStatus(airline, flight, timestamp);
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
    * Pay the passenger
    */
    async pay() {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        const { pay } = contract;

        try {
            const transaction = await pay();
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
    * Get the pending payment to the passenger
    */
    async getPendingPayment(airline, flight, date) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { getPendingPaymentAmount } = contract;

        try {
            const transaction = await getPendingPaymentAmount(this.App.metamaskAccountID);

            console.log("Amount", ethers.utils.formatEther(transaction));

            return {
                success: true,
                amount: ethers.utils.formatEther(transaction),
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
    * Get the status code for a given flight
    */
    async getFlightStatusCode(airline, flight, date) {

        if (!this.App.web3Provider) {
            let errorMessage = "Please ensure that your wallet is connected"

            return {
                success: false,
                error: errorMessage
            }
        }

        await this.getMetamaskAccountID();

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.metamaskAccountID);

        // Set the contract
        const contract = this.App.flightSuretyData.connect(signer);

        const { getFlightStatusCode } = contract;

        const timestamp = dateToTimestamp(date);

        try {
            const transaction = await getFlightStatusCode(airline, flight, timestamp);
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

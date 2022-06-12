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
            owner: "0x0000000000000000000000000000000000000000"
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
     * Authorize the Flight Surety Data contract
     */
    async authorizeCaller() {
        const { authorizeCaller } = this.App.flightSuretyData;
        try {
            const transaction = await authorizeCaller(config.appAddress, {
                from: this.owner
            })
            await transaction.wait();
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
    * DeAuthorize the Flight Surety Data contract
    */
    async deauthorizeCaller() {
        const { deauthorizeCaller } = this.App.flightSuretyData;
        try {
            const transaction = await deauthorizeCaller(config.appAddress, {
                from: this.owner
            })
            await transaction.wait();
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = EthereumService;
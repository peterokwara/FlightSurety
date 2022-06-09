const { ethers, BigNumber } = require("ethers");
const FlightSuretyApp = require('../../../build/contracts/FlightSuretyApp.json');
const FlightSuretyData = require('../../../build/contracts/FlightSuretyData.json');
const config = require("../data/config.local.json");

/**
 * Class to handle all ethereum transactions/communications
 */
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

        // Load web3 provider
        this.App.web3Provider = new ethers.providers.JsonRpcProvider(config.url);

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

        // Authorize the data contract
        await this.authorizeCaller(config.appAddress);

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
     * Registers a single oracle
     * @param index account index to register 
     */
    async registerOracle(index) {

        // Set the registration amount to be one ether
        const registrationAmount = ethers.utils.parseEther("1");

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.accounts[index]);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        try {
            const transaction = await contract.registerOracle({
                value: registrationAmount,
            })
            await transaction.wait();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get the indexes for a given oracle account
     * @param index account index to get indexes from
     */
    async getMyIdexes(index) {

        // Set the signer
        const signer = this.App.web3Provider.getSigner(this.App.accounts[index]);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        let result;
        try {
            const transaction = await contract.getMyIndexes();
            console.log(transaction);
            return {
                address: this.App.accounts[index],
                index: transaction
            }
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * Function to submit an oracle response
     * @param oracle Registered oracles
     * @param oracleResponse Oracle responses
     */
    async submitOracleResponse(oracle, oracleResponse) {

        // Set the signer
        const signer = this.App.web3Provider.getSigner(oracle);

        // Set the contract
        const contract = this.App.flightSuretyApp.connect(signer);

        try {
            console.log("Submitting oracle response");
            const transaction = await contract
                .submitOracleResponse(oracleResponse.index, oracleResponse.airline, oracleResponse.flight, oracleResponse.timestamp, oracleResponse.statusCode)
            await transaction.wait();
        } catch (error) {
            console.log(error)
        }
    }


    /**
     * Function to fetch a response for an oracle from events emitted from the smart
     * contract
     * @returns Requested information including index, airline, flight and timestamp
     */
    async oracleRequest() {

        // Get the block
        const block = await this.App.web3Provider.getBlockNumber()

        try {
            const requestEvent = await this.App.flightSuretyApp
                .queryFilter('OracleRequest', block - 4, block);

            return {
                index: requestEvent[0].args[0],
                airline: requestEvent[0].args[1],
                flight: requestEvent[0].args[2],
                timestamp: requestEvent[0].args[3]
            }
        } catch (error) {
            console.log(error);
        }
        // return request.returnValue;
    }

    /**
     * Fetch flight status (test)
     */
    async fetchFlightStatus() {

        let airline = this.App.accounts[2];
        let flight = "5J 814";
        let timestamp = Math.floor(Date.now() / 1000);

        const { fetchFlightStatus } = this.App.flightSuretyApp;

        try {
            const transaction = await fetchFlightStatus(airline, flight, timestamp, {
                from: this.App.owner
            })
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = EthereumService;
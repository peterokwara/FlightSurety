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
     * @param index Orcle indexes
     * @param airline Address of the airline
     * @param flight The name of the flight
     * @param timestamp Time of the flight
     * @param statusCode The status code of the flight
     */
    async submitOracleResponse(oracle, index, airline, flight, timestamp, statusCode) {
        const { submitOracleResponse } = this.App.contracts.FlightSuretyApp;
        try {
            // const transaction = await submitOracleResponse(index, airline, flight, timestamp, statusCode,
            //     { from: oracle });
            const transaction = await submitOracleResponse.connect(oracle).sign(index, airline, flight, timestamp, statusCode)
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

        const request = this.flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, (error, event) => {

            // Return an error if any
            if (error) {
                throw new Error(error);
            }

            return event;
        });

        return request.returnValue;
    }
}

module.exports = EthereumService;
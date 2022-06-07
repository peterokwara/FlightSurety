const { ethers, BigNumber } = require("ethers");
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import config from "../data/config.local.json"

/**
 * Class to handle all ethereum transactions/communications
 */
class EthereumService {

    constructor() {
        this.App = {
            web3Provider: null,
            accounts: [],
            contracts: {},
            owner: "0x0000000000000000000000000000000000000000"
        }
    }

    /**
     * Initialize web3
     */
    async initWeb3() {

        // Load web3 provider
        this.web3Provider = new ethers.providers.Web3Provider(config.url.replace('http', 'ws'));

        // Get all accounts
        this.accounts = web3Provider.listAccounts();

        // Set the owner account
        this.owner = this.accounts[0];

        // Get an instance of the contract
        this.App.contracts.flightSuretyApp = new ethers.Contract(FlightSuretyData.abi, config.appAddress);
        this.App.contracts.flightSuretyData = new ethers.Contract(FlightSuretyApp.abi, config.dataAddress);

    }


    /**
     * Authorize the Flight Surety Data contract
     */
    async authorizeCaller() {
        const { authorizeCaller } = this.App.contracts.flightSuretyData;
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
     * Registers an oracle
     * @param index account index to register 
     */
    async registerOracle(index) {
        const { registerOracle } = this.App.contracts.flightSuretyApp;

        // Set the registration amount to be one ether
        let registrationAmount = BigNumber.from("1000000000000000000")
        registrationAmount = formatUnits(registrationAmount);

        try {
            const transaction = await registerOracle({
                from: this.accounts[index],
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
    getMyIdexes(index) {
        const { getMyIdexes } = this.App.contracts.FlightSuretyApp;
        let result;
        try {
            const transaction = await getMyIdexes({
                from: this.accounts[index],
            })
            result = await transaction.wait();
        } catch (error) {
            console.log(error);
        }

        // Return the indexes
        return {
            account: this.accounts[index],
            index: result
        };
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
    submitOracleResponse(oracle, index, airline, flight, timestamp, statusCode) {
        const { submitOracleResponse } = this.App.contracts.FlightSuretyApp;
        try {
            const transaction = await submitOracleResponse(index, airline, flight, timestamp, statusCode,
                { from: oracle });
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
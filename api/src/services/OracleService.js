const ServiceFactory = require("../factories/serviceFactory");

// The random status codes
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;

// Status codes array
const statusCodes = [
    STATUS_CODE_UNKNOWN,
    STATUS_CODE_ON_TIME,
    STATUS_CODE_LATE_AIRLINE,
    STATUS_CODE_LATE_WEATHER,
    STATUS_CODE_LATE_TECHNICAL,
    STATUS_CODE_LATE_OTHER
]

let oracleAccounts = 20;
let oracleAccountOffset = 20;


class OracleService {

    constructor() {
        this.App = {
            oracles: [],
            oracleResponse: {
                index: "",
                airline: "",
                flight: "",
                timestamp: "",
                statusCode: ""
            }
        }
    }

    /**
     * Function to get a random status code
     * @returns A random status code
     */
    async getRandomStatusCode() {
        return statusCodes[Math.floor(Math.random() * statusCodes.length)]
    }

    /**
     * Function to register all oracles
     */
    async registerOracles() {

        // Fetch the ethereum service
        const ethereumService = ServiceFactory.get("ethereum-service");

        // Loop through 20 oracle accounts
        for (let index = 0; index < oracleAccounts; index++) {

            // Register an oracle
            try {
                await ethereumService.registerOracle(index + oracleAccountOffset);
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
    * Get oracle indexes
    */
    async getOracleIndexes() {

        // Fetch the ethereum service
        const ethereumService = ServiceFactory.get("ethereum-service");

        // Loop through the 20 oracle accounts
        for (let index = 0; index < oracleAccounts; index++) {

            // Get the indexes of the stored accounts
            try {

                // Get indexes for the registered oracles
                const result = await ethereumService.getMyIdexes(index + oracleAccountOffset);

                // Store the result
                this.App.oracles.push(result);
            } catch (error) {
                console.log(error);
            }
        }

    }

    /**
     * Submit an oracle response
     */
    async submitResponse() {

        // Fetch the ethereum service
        const ethereumService = ServiceFactory.get("ethereum-service");

        console.log("Oracles", this.App.oracles)

        // Submit the oracle request
        for (let index = 0; index < this.App.oracles.length; index++) {
            if (this.App.oracles[index].index.includes(this.App.oracleResponse.index)) {
                await ethereumService
                    .submitOracleResponse(this.App.oracles[index].address, this.App.oracleResponse);
            }
        }
    }

    /**
     * Listen to submit oracle request
     */
    async oracleRequest() {
        // Fetch the ethereum service
        const ethereumService = ServiceFactory.get("ethereum-service");

        try {
            // Listen to the submit oracle request
            const response = await ethereumService.oracleRequest();
            this.App.oracleResponse = {
                index: response.index,
                airline: response.airline,
                flight: response.flight,
                timestamp: response.timestamp,
                statusCode: await this.getRandomStatusCode()
            }
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = OracleService;
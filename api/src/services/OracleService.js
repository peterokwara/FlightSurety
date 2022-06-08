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
            oracles: []
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
        for (let index = 1; index < oracleAccounts; index++) {

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

        // Loop through the 20 oracle accounts
        for (let index = 0; index < oracleAccounts; index++) {

            // Get the indexes of the stored accounts
            try {

                // Get indexes for the registered oracles
                const result = await EthereumService.getMyIdexes(index);

                // Store the result
                oracles.push(result);
            } catch (error) {
                console.log(error);
            }
        }

    }

    /**
     * Submit an oracle response
     */
    async submitResponse() {

        // Get the oracle request
        const request = await EthereumService.oracleRequest();

        // Generate a status code
        const statusCode = this.getRandomStatusCode();

        // Submit the oracle request
        for (let index = 0; index < this.oracles.length; index++) {
            if (oracles[a].index.includes(request.index)) {
                await EthereumService
                    .submitOracleResponse(oracles[index].address, request.index, request.airline, request.timestamp, statusCode);
            }
        }
    }
}

module.exports = OracleService;
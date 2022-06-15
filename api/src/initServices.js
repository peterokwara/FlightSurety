const ServiceFactory = require("./factories/serviceFactory");
const EthereumService = require("./services/ethereumService");
const OracleService = require("./services/oracleService");


/**
 * Initialize all the services
 */
initServices = async () => {
    // Register the Ethereum service
    ServiceFactory.register("ethereum-service", () => new EthereumService());

    // Register the Oracle service
    ServiceFactory.register("oracle-service", () => new OracleService());
};

module.exports = { initServices };
/**
 * Factory for creating services
 */
class ServiceFactory {
    /**
     * Store the service callbacks
     */
    static _services = {};

    /**
     * Store the created instances
     */
    static _instances = {};

    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    static register(name, instanceCallback) {
        if (!name) {
            throw new Error(
                "You must provide the name parameter to register a service"
            );
        }
        if (!instanceCallback) {
            throw new Error(
                "You must provide the instanceCallback parameter to register a service"
            );
        }
        this._services[name] = instanceCallback;
    }

    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    static unregister(name) {
        delete this._services[name];
        delete this._instances[name];
    }

    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    static get(name) {
        if (!this._instances[name] && this._services[name]) {
            this._instances[name] = this._services[name]();
        }
        if (this._instances[name]) {
            return this._instances[name];
        }
        throw new Error(`Unknown type in ServiceFactory.get '${name}'`);
    }
}

module.exports = ServiceFactory;
const yaml = require('js-yaml');

/**
 * @class Yaml
 */
class Yaml {
    static get EXP() {
        return 'yml';
    }

    /**
     *
     * @param {String} data yml
     * @returns {Object} obj
     */
    static parse(data) {
        return yaml.safeLoad(data, { json: true });
    }

    /**
     *
     * @param {Object} obj
     * @returns {String} data yml
     */
    static stringify(obj) {
        return yaml.safeDump(obj);
    }

}

module.exports = Yaml;

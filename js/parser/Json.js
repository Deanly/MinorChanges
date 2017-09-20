
/**
 * @class Json
 */
module.exports =
class Json {

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get EXP() { return 'json' }

    /**
     *
     * @param {String} string
     * @return {Object}
     */
    static parse(string) {
        return JSON.parse(string);
    }

    /**
     *
     * @param {Object} obj
     * @return {String} data for write
     */
    static stringify(obj) {
        return JSON.stringify(obj, null, 4);
    }
}


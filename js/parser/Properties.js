
/**
 * @class Properties
 */
class Properties {

    static get EXP() { return 'properties'; }

    /**
     *
     * @param {Object} obj
     * @returns {Array}
     */
    static stringify(obj) {

        const recursive = (obj, prefix) => {
            let result = '';
            const keys = Object.keys(obj);

            keys.forEach(function (key) {
                let _prefix;

                if (typeof obj[key] === 'object') {
                    let _currPrefix = key.concat('.');
                    _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
                    result += recursive(obj[key], _prefix);
                } else {
                    _prefix = prefix ? prefix.concat(key) : key;
                    result += _prefix.concat('=').concat(obj[key]).concat('\n');
                }
            });
            return result;
        };

        return recursive(obj, null);
    }

    /**
     *
     * @param {String} data
     * @returns {Object} obj
     */
    static parse(data) {
        const CRLF = data.indexOf('\r\n') > -1 ? '\r\n' : '\n'
            , lines = data.split(CRLF)
            , obj = {};

        const recursive = (keys, value, result) => {
            if (keys.length === 1) {
                const key = keys[0];
                result[key] = value;
                return result;
            } else {
                const key = keys[0];
                result[key] = recursive(keys.slice(1), value, result[key] || {});
                return result;
            }
        };

        lines.forEach(function (line) {
            const divider = line.indexOf('=');
            const key = line.slice(0, divider);
            const value = line.slice(divider + 1);

            const keys = key.split('.');
            recursive(keys, value, obj);
        });

        return obj;
    }

}

module.exports = Properties;



/**
 * @class Properties
 */
class Properties {
    constructor(parsing) {
        parsing && this.parse(parsing);
    }

    getObject() {
        return this.obj;
    }

    /**
     *
     * @param {Object} obj
     * @param {String} prefix
     * @returns {Array}
     */
    getLineArray(obj, prefix) {
        const result = [];
        const keys = Object.keys(obj);
        keys.forEach(function (key) {
            let _prefix;

            if (typeof obj[key] === 'object') {
                let _currPrefix = key.concat('.');
                _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
                result.push.apply(result, object2properties(obj[key], _prefix));
            } else {
                _prefix = prefix ? prefix.concat(key) : key;
                result.push(_prefix.concat('=').concat(obj[key]));
            }
        });

        return result;
    }

    parse(data) {
        switch(typeof data) {
            case 'array':
                this._linesToObject(data);
                break;
            case 'object':
                this.obj = data;
                break;
            case 'string':
                break;
            default:
                console.error('Unable to parse data in Properties');
        }
    }

    /**
     *
     * @param {Array} lines
     * @returns {Object} json
     */
    _linesToObject(lines) {
        const result = {};

        const recursive = (keys, value, result) => {
            if (keys.length === 1) {
                const key = keys[0];
                result[key] = value;
                return result;
            } else {
                const key = keys[0];
                result[key] = inflateItem(keys.slice(1), value, result[key] || {});
                return result;
            }
        };

        lines.forEach(function (line) {
            const divider = line.indexOf('=');
            const key = line.slice(0, divider);
            const value = line.slice(divider + 1);

            const keys = key.split('.');
            recursive(keys, value, result);
        });

        return result;
    }


}

module.exports = Properties;


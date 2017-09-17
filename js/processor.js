const files = require('./util/files')
    , jsonParser = require('./parser/Properties')
    , assert = require('assert')
    , yaml = require('js-yaml')
    , fs = require('fs')
    , _ = require('lodash');


/**
 * Yaml to Properties (.yml to .properties)
 *
 * @param {Source} source
 * @param {Distribute} dist
 */
function processYaml2Properties (source, dist) {

    const data = yaml.safeLoad(fs.readFileSync(source.getFullPath(), 'utf8'));

    const entries = jsonParser.deflate(data);

    files.write(
        dist.dirPath,
        dist.getTargetFileName(source.filename),
        entries);
}

/**
 * Properties to Yaml (.properties to .yml)
 *
 * @param {Source} source
 * @param {Distribute} dist
 */
function processProperties2Yaml (source, dist) {

    let data = fs.readFileSync(source.getFullPath(), 'utf8');

    const CRLF = data.indexOf('\r\n') > -1 ? '\r\n' : '\n';

    data = jsonParser.inflate(data.split(CRLF));

    const entries = yaml.safeDump(data);

    files.write(
        dist.dirPath,
        dist.getTargetFileName(source.filename),
        [entries]);
}

/**
 * It is the entry point of the module, generalizes the source file and the target file,
 * and executes the parsing module suitable for each source.
 *
 * @param options
 */
function run (options) {
    // Identify the current path
    const path = process.cwd();

    // The default options
    const _default = {
        config: { src: path, dist: path + '/dist' },
        info: [],
        target: 'properties',
    };

    // Options used
    const _options = _.defaultsDeep(options, _default);

    // Create source map
    const srcMap = mapSources(_options.config.src);

    // Generalized with deployment information objects
    const dist = new Distribute(_options.config.dist, _options.target);

    // Parsing will proceed
    for (let i = 0; i < srcMap.length; i++) {

        process.stdout.write('Convert ' + srcMap[i].getFullname() + ' to ' + srcMap[i].filename + '.' + _options.target);

        try{
            switch(srcMap[i].exp + '2' + _options.target) {
                case 'yml2properties':
                    processYaml2Properties(srcMap[i], dist);
                    break;
                case 'properties2yml':
                    processProperties2Yaml(srcMap[i], dist);
                    break;
                default:
                    process.stdout.write('\t...Not Defined\n');
                    continue;
            }
        } catch(e) {
            process.stdout.write('\t...Error\n');
            console.log(e);
            continue;
        }

        process.stdout.write('\t...Done\n');

    }
}

/**
 * Class to generalize information of parsed source.
 * @class Source
 */
class Source {
    constructor(dirpath, fullname){
        this.setDirPath(dirpath);
        this.setFullname(fullname);
    }

    setDirPath(src) {
        assert(typeof src === 'string');

        const splitedSrc = src.split('/');
        this.dirPath = !splitedSrc[splitedSrc.length - 1] ? src.substring(0, src.length - 1) : src;
    }

    setFullname(fullname) {
        assert(typeof fullname === 'string');

        const splited = fullname.split('.');
        this.filename = splited.slice(0, splited.length - 1).join('.');
        this.exp = splited[splited.length - 1];
    }

    getFullPath() {
        return this.dirPath + '/' + this.filename + '.' + this.exp;
    }

    getFullname() {
        return this.filename + '.' + this.exp;
    }
}

/**
 * Classes for generalizing information for distribution.
 * @class Distribute
 */
class Distribute {
    constructor(dist, target) {
        this.dirPath = dist;
        this.exp = target;
    }

    getTargetFileName(filename) {
        return filename + '.' + this.exp;
    }
}

/**
 *
 * @param src A path of file or directory
 * @returns {Array}
 */
function mapSources(src) {
    const splitedSrc = src.split('/');
    const isDir = !splitedSrc[splitedSrc.length - 1] || splitedSrc[splitedSrc.length - 1].indexOf('.') === -1;

    const sourcePath = isDir ? src :
        (splitedSrc.slice(0, splitedSrc.length - 1).join('/'));

    const fileMap = isDir ?
        files.getFiles(sourcePath) :
        splitedSrc.slice(splitedSrc.length - 1, splitedSrc.length);

    const dataMap = [];
    for (let i = 0; i < fileMap.length; i++) {
        dataMap[i] = new Source(sourcePath, fileMap[i]);
    }

    return dataMap;
}

module.exports = run;
// export default run


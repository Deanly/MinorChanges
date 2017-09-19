const files = require('./util/files')
    , assert = require('assert')
    , fs = require('fs')
    , _ = require('lodash');


/**
 * Initializes the parser.
 * If you want to add a parser, implement exp, parse and stringify as static and put it in '/js/parser/'.
 *
 * @returns {Object} parsers
 */
function initParser() {
    const parsers = {}
        , fileMap = files.readDir('./js/parser', 'js');

    let temp;
    fileMap.forEach(path => {
        temp = require('./parser/'.concat(path.substring(0, path.length - 3)));

        if (typeof temp === 'function') {

            if (temp.EXP !== undefined &&
                typeof temp.parse === 'function' &&
                typeof temp.stringify === 'function'
            ) {
                parsers[temp.EXP] = temp;
            }
        }
    });

    return parsers;
}


/**
 * It is the entry point of the module, generalizes the source file and the target file,
 * and executes the parsing module suitable for each source.
 *
 * @param options
 */
function run(options) {

    if (!options.src)
        return console.log('Set the source path using the -s option. (help with -h)');

    // The default options
    const _default = {
        src: '',
        dist: process.cwd() + '/dist',
        target: 'properties',
    };


    const _options  = _.defaultsDeep(options, _default) // Options used
        , srcColl   = mapSources(_options.src)          // Create source map
        , parserMap = initParser();                     // Initialize parsers


    srcColl.forEach(convert(parserMap, options));
}

/**
 *
 * @param parserMap
 * @param options
 * @returns {function(*)}
 */
function convert(parserMap, options) {
    let representator
      , generator;

    return (source) => {
        if (!parserMap[source.exp] || !parserMap[options.target])
            return console.log('Check source name..  '.concat(source.getFullname()));

        representator = parserMap[source.exp].parse || null;
        generator = parserMap[options.target].stringify || null;

        console.log(source.getFullname().concat('  >>>  ')
            .concat(source.filename).concat('.').concat(options.target));

        if (typeof representator === 'function' &&
            typeof generator === 'function' &&
            source.exp !== options.target
        ) {

            try{
                files.write(
                    options.dist,
                    source.filename.concat('.').concat(options.target),
                    generator(representator(fs.readFileSync(source.getFullPath(), 'utf8'))));
            } catch (e) {
                console.log('Failed : ' + e)
            }

        } else {

            if (source.exp === options.target)
                console.log('Skip, Same expression..');
            else
                console.log('Not Defined Parser..');

        }
    };
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
 *
 * @param src A path of file or directory
 * @returns {Array}
 */
function mapSources(src, exp) {
    const splitedSrc    = src.split('/')

        , isDir         = !splitedSrc[splitedSrc.length - 1] ||
                            splitedSrc[splitedSrc.length - 1].indexOf('.') === -1

        , sourcePath    = isDir ?
                            src :
                            (splitedSrc.slice(0, splitedSrc.length - 1).join('/'))

        , fileMap       = isDir ?
                            files.readDir(sourcePath, exp) :
                            splitedSrc.slice(splitedSrc.length - 1, splitedSrc.length)

        , dataMap       = [];

    for (let i = 0; i < fileMap.length; i++) {
        dataMap[i] = new Source(sourcePath, fileMap[i]);
    }

    return dataMap;
}

module.exports = run;
// export default run


const fs = require('fs');

/**
 *
 * @param dir
 * @param extension
 * @returns {Array}
 */
exports.readDir = function (dir, extension = '*') {
    if (!fs.existsSync(dir)) {
        console.error('The source directory or file [ ' + dir + ' ] does not exist.');
        return [];
    }

    const regex = new RegExp('\\.' + extension)
        ,files = fs.readdirSync(dir)
        ,_files = [];

    if (files) {
        files.forEach(function (file) {
            if (regex.test(file)) {
                _files.push(file);
            }
        });
    }
    return _files;
};



/**
 *
 * @param {String} dir
 * @param {String} file
 * @param {String} data
 */
function write (dir, file, data) {
    // Create a direcotry if doesn't exist.
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const writeStream = fs.createWriteStream(dir.concat('/').concat(file), {
        autoClose: false
    });

    writeStream.write(data);
    writeStream.end(); // Close the write stream
}
exports.write = write;

const fs = require('fs');

function getFiles (dir, extension) {
    if (!fs.existsSync(dir)) {
        console.error('The src directory [ ' + dir + ' ] does not exist.');
        return;
    }

    // Set the regex to match any string ending with extension
    const regex = new RegExp('\\.' + extension);
    // Retrieve all the files in the directory
    const files = fs.readdirSync(dir);
    // The identified json file names
    const _files = [];
    if (files) {
        files.forEach(function (file) {
            if (regex.test(file)) {
                _files.push(file);
            }
        });
    }
    return _files;
}

/**
 *
 * @param dir
 * @returns {*}
 */
exports.read = function (dir) {
    if (!fs.existsSync(dir)) {
        console.error('"' + dir + '" does not exist.');
        return;
    }

    return fs.readdirSync(dir);
};

/**
 *
 * @param dir
 * @param file
 * @param entries
 */
function write (dir, file, entries) {
    // Create a direcotry if doesn't exist.
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const writeStream = fs.createWriteStream(dir.concat('/').concat(file), {
        autoClose: false
    });

    entries.forEach(function (entry) {
        writeStream.write(entry.concat('\n'));
    });

    writeStream.end(); // Close the write stream
}
exports.write = write;

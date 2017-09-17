#!/usr/bin/env node
'use strict';

const program = require('commander')
    , processor = require('./js/processor');

program
    .option('-d, --dist <dist>', 'Directory where the converted file will be saved. (default=./dist)')
    .option('-s, --source <source>', 'The source file or directory to convert. If set to a directory, convert all files in the directory.')
    .option('-t, --target <target>', 'A extension of the file to be converted.')
    .parse(process.argv);

const options = {};

if (program.dist) {
    if (!options.config)
        options.config = {};

    options.config.dist = program.dist;
}

if (program.source) {
    if (!options.config)
        options.config = {};

    options.config.src = program.source;
}

if (program.target) {
    options.target = program.target;
}

processor(options);

#!/usr/bin/env node
'use strict';

const program = require('commander')
    , processor = require('./js/processor');

program
    .option('-d, --dist <dist>', 'Directory where the converted file will be saved. \n\t[default: ./dist]\n')
    .option('-s, --source <source>', 'The source file or directory to convert. If set to a directory, convert all files in the directory.\n')
    .option('-t, --target <target>', 'A extension of the file to be converted. \n\t[default: properties]\n')
    .parse(process.argv);

const options = {};

if (program.dist) {
    options.dist = program.dist;
}

if (program.source) {
    options.src = program.source;
}

if (program.target) {
    options.target = program.target;
}

processor(options);

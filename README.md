# MinorChanges
It is a simple project to convert files for  text-based data.

## Install
Need a Nodejs (Supports ES6)
```$xslt
$ npm i
```

## Supported formats
* Json (.json)
* properties (.properties)
* yaml (.yml)

## Usage
View Help
```$xslt
$ node index.js --help
```

properties to yaml
```$xslt
$ node index.js -s {source-path} -d {dist-path} -t yml
```

yaml files to properties
```$xslt
$ node index.js -s ./my_src/ -d ./mydist/ -t properties
```
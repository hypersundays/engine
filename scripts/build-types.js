'use strict';

var fs = require('fs');
var path = require('path');
var getBuildEntries = require('./build-entries').getBuildEntries;

var ROOT_DIR = path.resolve(__dirname, '..');
var TYPES_DIR = path.join(ROOT_DIR, 'dist', 'types');

function ensureDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function toPosix(filePath) {
    return filePath.replace(/\\/g, '/');
}

function getTypeImportPath(typeFilePath, sourceFilePath) {
    var relativePath = path.relative(path.dirname(typeFilePath), sourceFilePath);
    if (relativePath[0] !== '.') relativePath = './' + relativePath;
    return toPosix(relativePath);
}

function writeTypeFile(entryName, sourceFilePath) {
    var outputPath = path.join(TYPES_DIR, entryName + '.d.ts');
    var importPath = getTypeImportPath(outputPath, sourceFilePath);

    ensureDirectory(path.dirname(outputPath));

    fs.writeFileSync(
        outputPath,
        [
            'declare const moduleExports: typeof import(\'' + importPath + '\');',
            'export = moduleExports;',
            ''
        ].join('\n')
    );
}

function copyAmbientTypes() {
    var ambientTypes = path.join(ROOT_DIR, 'glsl.d.ts');
    fs.copyFileSync(ambientTypes, path.join(TYPES_DIR, 'glsl.d.ts'));
}

function buildTypes() {
    var entries = getBuildEntries(ROOT_DIR);

    ensureDirectory(TYPES_DIR);
    copyAmbientTypes();

    Object.keys(entries).forEach(function(entryName) {
        writeTypeFile(entryName, entries[entryName]);
    });
}

buildTypes();

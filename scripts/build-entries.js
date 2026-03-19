'use strict';

var fs = require('fs');
var path = require('path');

var PUBLIC_ROOTS = [
    'components',
    'core',
    'dom-renderables',
    'dom-renderers',
    'math',
    'physics',
    'polyfills',
    'renderers',
    'render-loops',
    'transitions',
    'utilities',
    'webgl-geometries',
    'webgl-materials',
    'webgl-renderables',
    'webgl-renderers',
    'webgl-shaders'
];

var SKIP_DIRECTORIES = {
    test: true,
    perf: true
};

function walk(dir, collector) {
    var entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(function(entry) {
        if (entry.name[0] === '.') return;

        var absolutePath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (SKIP_DIRECTORIES[entry.name]) return;
            walk(absolutePath, collector);
            return;
        }

        if (entry.isFile() && path.extname(entry.name) === '.js') {
            collector.push(absolutePath);
        }
    });
}

function createEntryName(rootDir, filePath) {
    return path
        .relative(rootDir, filePath)
        .replace(/\\/g, '/')
        .replace(/\.js$/, '');
}

function getBuildEntries(rootDir) {
    var entries = {};
    var files = [];

    entries.index = path.join(rootDir, 'index.js');

    PUBLIC_ROOTS.forEach(function(publicRoot) {
        walk(path.join(rootDir, publicRoot), files);
    });

    files.sort();

    files.forEach(function(filePath) {
        entries[createEntryName(rootDir, filePath)] = filePath;
    });

    return entries;
}

module.exports = {
    PUBLIC_ROOTS: PUBLIC_ROOTS,
    getBuildEntries: getBuildEntries
};

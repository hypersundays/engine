'use strict';

require.extensions['.glsl'] = function(module, filename) {
    module.exports = 'shader:' + filename;
};

global.window = {
    addEventListener: function() {},
    cancelAnimationFrame: function() {},
    devicePixelRatio: 1,
    performance: {
        now: Date.now
    },
    requestAnimationFrame: function() {
        return 0;
    }
};

global.document = {
    addEventListener: function() {},
    hidden: false
};

var famous = require('../../index');
var getBuildEntries = require('../../scripts/build-entries').getBuildEntries;

describe('public api surface', function() {
    it('exposes the documented top-level namespaces', function() {
        expect(Object.keys(famous)).toEqual([
            'components',
            'core',
            'renderLoops',
            'domRenderables',
            'domRenderers',
            'math',
            'physics',
            'renderers',
            'transitions',
            'utilities',
            'webglRenderables',
            'webglRenderers',
            'webglGeometries',
            'webglMaterials',
            'webglShaders',
            'polyfills'
        ]);
    });

    it('keeps core deep imports reachable through the build entry graph', function() {
        var entries = getBuildEntries(process.cwd());

        expect(entries).toHaveProperty('index');
        expect(entries).toHaveProperty('core/FamousEngine');
        expect(entries).toHaveProperty('dom-renderables/DOMElement');
        expect(entries).toHaveProperty('physics/bodies/Particle');
        expect(entries).toHaveProperty('physics/forces/Spring');
        expect(entries).toHaveProperty('webgl-geometries/primitives/Box');
        expect(entries).toHaveProperty('webgl-renderables/lights/PointLight');
    });
});

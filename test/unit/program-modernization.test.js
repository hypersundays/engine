'use strict';

require.extensions['.glsl'] = function(module, filename) {
    module.exports = 'shader:' + filename;
};

var ContextWebGL = require('../../webgl-renderers/test/helpers/ContextWebGL');
var Program = require('../../webgl-renderers/Program');

describe('program modernization', function() {
    it('normalizes shader sources from strings and default exports', function() {
        var program = new Program(new ContextWebGL());

        expect(program.normalizeShaderSource('void main() {}')).toBe('void main() {}');
        expect(program.normalizeShaderSource({ default: 'void main() {}' })).toBe('void main() {}');
    });

    it('builds shader sources from normalized templates and replacements', function() {
        var program = new Program(new ContextWebGL());
        var source = program.buildShaderSource(
            ['precision mediump float;\n'],
            { default: 'void main() { #token }' },
            { '#token': 'gl_FragColor = vec4(1.0);' }
        );

        expect(source).toContain('precision mediump float;');
        expect(source).toContain('gl_FragColor = vec4(1.0);');
    });

    it('tracks the active shader profile for capability-aware program setup', function() {
        var webgl1Program = new Program(new ContextWebGL());
        var webgl2Program = new Program(new ContextWebGL(), { webgl2: true });

        expect(webgl1Program.shaderProfile).toBe('webgl1');
        expect(webgl2Program.shaderProfile).toBe('webgl2');
    });
});

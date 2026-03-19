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
            program.getShaderHeaderLines(),
            { default: '#fa_fragment_output_declaration\nvoid main() { #token }' },
            { '#token': '#fa_fragment_output_assignment' },
            'fragment'
        );

        expect(source).toContain('precision mediump float;');
        expect(source).toContain('#define FA_WEBGL2 0');
        expect(source).toContain('gl_FragColor = color;');
    });

    it('tracks the active shader profile for capability-aware program setup', function() {
        var webgl1Program = new Program(new ContextWebGL());
        var webgl2Program = new Program(new ContextWebGL(), { webgl2: true });

        expect(webgl1Program.shaderProfile).toBe('webgl1');
        expect(webgl2Program.shaderProfile).toBe('webgl2');
        expect(webgl2Program.getShaderHeaderLines().join('')).toContain('#define FA_WEBGL2 1');
        expect(webgl1Program.getShaderLanguageSettings()).toEqual({
            versionLine: '',
            attributeKeyword: 'attribute',
            varyingInKeyword: 'varying',
            varyingOutKeyword: 'varying',
            fragmentColorTarget: 'gl_FragColor',
            textureFunctionName: 'texture2D'
        });
        expect(webgl2Program.getShaderLanguageSettings()).toEqual({
            versionLine: '#version 300 es\n',
            attributeKeyword: 'in',
            varyingInKeyword: 'in',
            varyingOutKeyword: 'out',
            fragmentColorTarget: 'fa_fragColor',
            textureFunctionName: 'texture'
        });
        expect(webgl2Program.getShaderHeaderLines().join('')).toContain('#version 300 es');
        expect(webgl2Program.applyShaderLanguageSettings(
            '#fa_fragment_output_declaration\nvoid main(){#fa_fragment_output_assignment}',
            'fragment'
        )).toContain('out vec4 fa_fragColor;');
        expect(webgl2Program.applyShaderLanguageSettings(
            '#fa_attribute vec3 position; #fa_varying_out vec2 uv;',
            'vertex'
        )).toContain('in vec3 position; out vec2 uv;');
        expect(webgl2Program.applyShaderLanguageSettings(
            'gl_FragColor = texture2D(tex, uv); transpose(mat4(1.0)); inverse(mat4(1.0));',
            'fragment'
        )).toContain('fa_fragColor = texture(tex, uv); fa_transpose(mat4(1.0)); fa_inverse(mat4(1.0));');
        expect(webgl2Program.applyShaderLanguageSettings(
            '#fa_fragment_color = #fa_texture_sample(tex, uv);',
            'fragment'
        )).toContain('fa_fragColor = texture(tex, uv);');
    });

    it('gracefully aborts uniform setup when shader program linking fails', function() {
        var gl = new ContextWebGL();
        gl.getProgramParameter = function() {
            return false;
        };
        gl.getProgramInfoLog = function() {
            return 'failed to link';
        };
        gl.getUniformLocation = vi.fn();
        gl.uniform1iv = vi.fn();

        var failingProgram = new Program(gl);

        expect(failingProgram.program).toBeNull();
        expect(gl.getUniformLocation).not.toHaveBeenCalled();
        expect(gl.uniform1iv).not.toHaveBeenCalled();
    });
});

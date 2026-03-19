'use strict';

var Debug = require('../../webgl-renderers/Debug');

function createNode(tagName, textValue) {
    return {
        tagName: tagName,
        textContent: textValue || '',
        children: [],
        attributes: {},
        appendChild: function(child) {
            this.children.push(child);
            if (child.nodeType === 'text') {
                this.textContent += child.textContent;
            }
            return child;
        },
        setAttribute: function(name, value) {
            this.attributes[name] = value;
        }
    };
}

describe('debug renderer modernization', function() {
    it('renders shader errors without using innerHTML', function() {
        var originalDocument = global.document;
        var head = createNode('head');
        var body = createNode('body');

        global.document = {
            body: body,
            createElement: function(tagName) {
                return createNode(tagName);
            },
            createTextNode: function(text) {
                return {
                    nodeType: 'text',
                    textContent: text
                };
            },
            getElementsByTagName: function(tagName) {
                return tagName === 'head' ? [head] : [];
            }
        };

        var compileShader = Debug.call({
            gl: {
                compileShader: function() {}
            }
        });

        var shaderContext = {
            COMPILE_STATUS: 1,
            compileShader: function() {},
            getShaderInfoLog: function() {
                return 'ERROR: 0:2: Missing semicolon';
            },
            getShaderParameter: function() {
                return false;
            },
            getShaderSource: function() {
                return 'void main() {\n gl_FragColor = vec4(1.0)\n}';
            }
        };

        compileShader.call(shaderContext, {});

        expect(head.children).toHaveLength(1);
        expect(body.children).toHaveLength(1);
        expect(body.children[0].attributes.id).toBe('shaderReport');
        expect(body.children[0].children).toHaveLength(1);
        expect(body.children[0].children[0].children[0].children[0].textContent).toBe('ERROR');
        expect(body.children[0].children[0].children[1].children[0].textContent).toContain('gl_FragColor');
        expect(body.children[0].children[0].innerHTML).toBeUndefined();

        if (originalDocument === undefined) delete global.document;
        else global.document = originalDocument;
    });
});

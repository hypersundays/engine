'use strict';

require.extensions['.glsl'] = function(module, filename) {
    module.exports = 'shader:' + filename;
};

var vendorPrefix = require('../../utilities/vendorPrefix');

describe('vendor cleanup', function() {
    it('returns the unprefixed property name for modern CSS usage', function() {
        expect(vendorPrefix('transform')).toBe('transform');
        expect(vendorPrefix('box-sizing')).toBe('box-sizing');
    });

    it('subscribes to the standard visibilitychange event when supported', function() {
        var originalDocument = global.document;
        var originalRAF = global.requestAnimationFrame;
        var originalCAF = global.cancelAnimationFrame;
        var addEventListener = vi.fn();

        global.document = {
            hidden: false,
            addEventListener: addEventListener
        };
        global.requestAnimationFrame = function() {
            return 1;
        };
        global.cancelAnimationFrame = function() {};

        delete require.cache[require.resolve('../../render-loops/RequestAnimationFrameLoop')];

        var RequestAnimationFrameLoop = require('../../render-loops/RequestAnimationFrameLoop');

        new RequestAnimationFrameLoop();

        expect(addEventListener).toHaveBeenCalledWith(
            'visibilitychange',
            expect.any(Function)
        );

        delete require.cache[require.resolve('../../render-loops/RequestAnimationFrameLoop')];

        if (originalDocument === undefined) delete global.document;
        else global.document = originalDocument;

        if (originalRAF === undefined) delete global.requestAnimationFrame;
        else global.requestAnimationFrame = originalRAF;

        if (originalCAF === undefined) delete global.cancelAnimationFrame;
        else global.cancelAnimationFrame = originalCAF;
    });

    it('injects only the modern stylesheet path once', function() {
        var originalDocument = global.document;
        var appended = [];
        var createdStyles = [];
        var head = {
            appendChild: function(node) {
                appended.push(node);
            }
        };

        global.document = {
            documentElement: {
                appendChild: function(node) {
                    appended.push(node);
                }
            },
            createElement: function(tagName) {
                var node = {
                    tagName: tagName,
                    textContent: ''
                };
                createdStyles.push(node);
                return node;
            },
            getElementsByTagName: function(tagName) {
                return tagName === 'head' ? [head] : [];
            }
        };

        delete require.cache[require.resolve('../../renderers/inject-css')];

        var injectCSS = require('../../renderers/inject-css');

        injectCSS();
        injectCSS();

        expect(createdStyles).toHaveLength(1);
        expect(appended).toHaveLength(1);
        expect(createdStyles[0].textContent).toContain('transform-style:preserve-3d;');
        expect(createdStyles[0].textContent).not.toContain('-webkit-');
        expect(createdStyles[0].textContent).not.toContain('-moz-');

        delete require.cache[require.resolve('../../renderers/inject-css')];

        if (originalDocument === undefined) delete global.document;
        else global.document = originalDocument;
    });

    it('removes obsolete WebGL context name probes while keeping experimental fallback', function() {
        var calls = [];
        var canvas = {
            getContext: function(name) {
                calls.push(name);
                return name === 'experimental-webgl' ? { name: name } : null;
            }
        };

        var context = require('../../webgl-renderers/WebGLRenderer').prototype.getWebGLContext.call({}, canvas);

        expect(context).toEqual({ name: 'experimental-webgl' });
        expect(calls).toEqual(['webgl2', 'webgl', 'experimental-webgl']);
    });
});

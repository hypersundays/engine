'use strict';

require.extensions['.glsl'] = function(module, filename) {
    module.exports = 'shader:' + filename;
};

var WebGLRenderer = require('../../webgl-renderers/WebGLRenderer');
var loadURL = require('../../utilities/loadURL');

describe('runtime modernization', function() {
    it('allows render-loops/now to be required without a window global', function() {
        var originalWindow = global.window;
        var originalPerformance = global.performance;

        delete global.window;
        vi.stubGlobal('performance', {
            now: function() {
                return 123;
            }
        });

        delete require.cache[require.resolve('../../render-loops/now')];

        var now = require('../../render-loops/now');

        expect(now()).toBe(123);

        delete require.cache[require.resolve('../../render-loops/now')];

        if (originalWindow === undefined) delete global.window;
        else global.window = originalWindow;

        if (originalPerformance === undefined) delete global.performance;
        else global.performance = originalPerformance;
    });

    it('uses fetch when available while preserving callback support', async function() {
        var callback = vi.fn();
        var responseText = 'shader source';
        var fetchSpy = vi.fn().mockResolvedValue({
            text: vi.fn().mockResolvedValue(responseText)
        });

        vi.stubGlobal('fetch', fetchSpy);

        await expect(loadURL('/mesh.obj', callback)).resolves.toBe(responseText);

        expect(fetchSpy).toHaveBeenCalledWith('/mesh.obj', { signal: undefined });
        expect(callback).toHaveBeenCalledWith(responseText);

        delete global.fetch;
    });

    it('prefers the modern global requestAnimationFrame APIs', function() {
        var originalRAF = global.requestAnimationFrame;
        var originalCAF = global.cancelAnimationFrame;
        var callback = function() {};

        vi.stubGlobal('requestAnimationFrame', function(fn) {
            expect(fn).toBe(callback);
            return 17;
        });
        vi.stubGlobal('cancelAnimationFrame', function() {
            return undefined;
        });

        delete require.cache[require.resolve('../../polyfills/animationFrame')];

        var animationFrame = require('../../polyfills/animationFrame');

        expect(animationFrame.requestAnimationFrame(callback)).toBe(17);
        expect(typeof animationFrame.cancelAnimationFrame).toBe('function');

        delete require.cache[require.resolve('../../polyfills/animationFrame')];

        if (originalRAF === undefined) delete global.requestAnimationFrame;
        else global.requestAnimationFrame = originalRAF;

        if (originalCAF === undefined) delete global.cancelAnimationFrame;
        else global.cancelAnimationFrame = originalCAF;
    });

    it('allows ContainerLoop to be constructed without a window event target', function() {
        var originalAddEventListener = global.addEventListener;

        delete global.addEventListener;
        delete require.cache[require.resolve('../../render-loops/ContainerLoop')];

        var ContainerLoop = require('../../render-loops/ContainerLoop');
        var loop = new ContainerLoop();
        var updates = [];

        loop.update({
            update: function(time) {
                updates.push(time);
            }
        });

        loop.step(42);

        expect(updates).toEqual([42]);

        delete require.cache[require.resolve('../../render-loops/ContainerLoop')];

        if (originalAddEventListener === undefined) delete global.addEventListener;
        else global.addEventListener = originalAddEventListener;
    });

    it('prefers WebGL2 contexts before legacy fallbacks', function() {
        var calls = [];
        var renderer = {
            capabilities: {
                contextName: null,
                isWebGL2: false
            }
        };
        var canvas = {
            getContext: function(name) {
                calls.push(name);
                return name === 'webgl2' ? { name: name } : null;
            }
        };

        var context = WebGLRenderer.prototype.getWebGLContext.call(renderer, canvas);

        expect(context).toEqual({ name: 'webgl2' });
        expect(calls[0]).toBe('webgl2');
        expect(renderer.capabilities).toEqual({
            contextName: 'webgl2',
            isWebGL2: true
        });
    });

    it('falls back to WebGL1 when WebGL2 is unavailable', function() {
        var calls = [];
        var renderer = {
            capabilities: {
                contextName: null,
                isWebGL2: false
            }
        };
        var canvas = {
            getContext: function(name) {
                calls.push(name);
                return name === 'webgl' ? { name: name } : null;
            }
        };

        var context = WebGLRenderer.prototype.getWebGLContext.call(renderer, canvas);

        expect(context).toEqual({ name: 'webgl' });
        expect(calls.slice(0, 2)).toEqual(['webgl2', 'webgl']);
        expect(renderer.capabilities).toEqual({
            contextName: 'webgl',
            isWebGL2: false
        });
    });

    it('keeps renderer program options on the WebGL1 shader profile while WebGL2 support is staged', function() {
        var options = WebGLRenderer.prototype.getProgramOptions.call({
            capabilities: {
                contextName: 'webgl2',
                isWebGL2: true
            }
        });

        expect(options).toEqual({
            debug: true,
            webgl2: true,
            capabilities: {
                contextName: 'webgl2',
                isWebGL2: true
            }
        });
    });
});

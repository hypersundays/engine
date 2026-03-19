'use strict';

describe('OBJ loader modernization', function() {
    it('forwards abort signals to the modernized asset loader', function() {
        var loadURLPath = require.resolve('../../utilities/loadURL');
        var objLoaderPath = require.resolve('../../webgl-geometries/OBJLoader');
        var originalLoadURLModule = require.cache[loadURLPath];
        var originalOBJLoaderModule = require.cache[objLoaderPath];
        var signal = { aborted: false };
        var requestHandle = { kind: 'request-handle' };
        var loadURL = vi.fn().mockReturnValue(requestHandle);

        require.cache[loadURLPath] = {
            id: loadURLPath,
            filename: loadURLPath,
            loaded: true,
            exports: loadURL
        };
        delete require.cache[objLoaderPath];

        var OBJLoader = require('../../webgl-geometries/OBJLoader');

        var returnedHandle = OBJLoader.load('mesh.obj', function() {}, {
            computeNormals: true,
            signal: signal
        });

        expect(returnedHandle).toBe(requestHandle);
        expect(loadURL).toHaveBeenCalledWith(
            'mesh.obj',
            expect.any(Function),
            { signal: signal }
        );

        delete require.cache[objLoaderPath];

        if (originalLoadURLModule) require.cache[loadURLPath] = originalLoadURLModule;
        else delete require.cache[loadURLPath];

        if (originalOBJLoaderModule) require.cache[objLoaderPath] = originalOBJLoaderModule;
    });

    it('returns cached geometry immediately for repeated loads', function() {
        var OBJLoader = require('../../webgl-geometries/OBJLoader');
        var cachedGeometry = { vertices: [1, 2, 3] };
        var callback = vi.fn();

        OBJLoader.cached['cached.obj'] = cachedGeometry;

        expect(OBJLoader.load('cached.obj', callback)).toBe(cachedGeometry);
        expect(callback).toHaveBeenCalledWith(cachedGeometry);

        delete OBJLoader.cached['cached.obj'];
    });
});

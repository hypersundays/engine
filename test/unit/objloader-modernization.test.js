'use strict';

describe('OBJ loader modernization', function() {
    it('forwards abort signals to the modernized asset loader', function() {
        var loadURLPath = require.resolve('../../utilities/loadURL');
        var objLoaderPath = require.resolve('../../webgl-geometries/OBJLoader');
        var originalLoadURLModule = require.cache[loadURLPath];
        var originalOBJLoaderModule = require.cache[objLoaderPath];
        var signal = { aborted: false };
        var loadURL = vi.fn();

        require.cache[loadURLPath] = {
            id: loadURLPath,
            filename: loadURLPath,
            loaded: true,
            exports: loadURL
        };
        delete require.cache[objLoaderPath];

        var OBJLoader = require('../../webgl-geometries/OBJLoader');

        OBJLoader.load('mesh.obj', function() {}, {
            computeNormals: true,
            signal: signal
        });

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
});

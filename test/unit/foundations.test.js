'use strict';

var Channel = require('../../core/Channel');
var Path = require('../../core/Path');
var Vec3 = require('../../math/Vec3');
var clamp = require('../../utilities/clamp');
var keyValueToArrays = require('../../utilities/keyValueToArrays');

describe('modernized foundations', function() {
    it('keeps utility helpers stable', function() {
        expect(clamp(-10, 0, 5)).toBe(0);
        expect(clamp(3, 0, 5)).toBe(3);
        expect(clamp(20, 0, 5)).toBe(5);

        expect(keyValueToArrays({ alpha: 1, beta: 2 })).toEqual({
            keys: ['alpha', 'beta'],
            values: [1, 2]
        });
    });

    it('preserves vector math behavior', function() {
        var v = new Vec3(1, 2, 3);

        v.add(new Vec3(4, 5, 6)).scale(0.5);

        expect([v.x, v.y, v.z]).toEqual([2.5, 3.5, 4.5]);
        expect(v.dot(new Vec3(2, 0, 1))).toBe(9.5);
    });

    it('keeps path helpers working for deep imports and export maps', function() {
        expect(Path.depth('body/1/2/3')).toBe(3);
        expect(Path.index('body/1/2/3')).toBe(3);
        expect(Path.parent('body/1/2/3')).toBe('body/1/2');
        expect(Path.isDescendentOf('body/1/2/3', 'body/1')).toBe(true);
        expect(Path.getSelector('body/1/2/3')).toBe('body');
    });

    it('keeps the single-threaded channel contract stable', function() {
        var channel = new Channel();
        var outbound = [];
        var inbound = [];

        channel.onmessage = function(message) {
            outbound.push(message);
        };

        channel.onMessage = function(message) {
            inbound.push(message);
        };

        channel.sendMessage({ frame: 1 });
        channel.postMessage({ type: 'ping' });

        expect(outbound).toEqual([{ frame: 1 }]);
        expect(inbound).toEqual([{ type: 'ping' }]);
    });
});

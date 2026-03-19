'use strict';

var CallbackStore = require('../../utilities/CallbackStore');
var clone = require('../../utilities/clone');
var ObjectManager = require('../../utilities/ObjectManager');
var Registry = require('../../utilities/Registry');
var strip = require('../../utilities/strip');

describe('utility modernization', function() {
    it('deep clones nested objects and arrays', function() {
        var original = {
            color: ['#fff', '#000'],
            nested: {
                enabled: true
            }
        };
        var copy = clone(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(copy.color).not.toBe(original.color);
        expect(copy.nested).not.toBe(original.nested);
    });

    it('registers and unregisters values in the registry', function() {
        var registry = new Registry();

        registry.register('mesh', { visible: true });
        expect(registry.get('mesh')).toEqual({ visible: true });
        expect(registry.getKeys()).toContain('mesh');

        registry.unregister('mesh');
        expect(registry.get('mesh')).toBeNull();
    });

    it('emits and removes callbacks through CallbackStore', function() {
        var store = new CallbackStore();
        var listener = vi.fn();

        var dispose = store.on('tick', listener);
        store.trigger('tick', { time: 10 });
        dispose();
        store.trigger('tick', { time: 20 });

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith({ time: 10 });
    });

    it('strips non-serializable nested values to null', function() {
        var payload = {
            ok: true,
            nested: {
                callback: function() {},
                value: 'safe'
            }
        };

        expect(strip(payload)).toEqual({
            ok: true,
            nested: {
                callback: null,
                value: 'safe'
            }
        });
    });

    it('reuses objects registered with ObjectManager pools', function() {
        function Box() {
            this.id = Math.random();
        }

        ObjectManager.register('Box', Box);

        var first = ObjectManager.requestBox();
        ObjectManager.freeBox(first);
        var second = ObjectManager.requestBox();

        expect(second).toBe(first);

        ObjectManager.disposeOf('Box');
    });
});

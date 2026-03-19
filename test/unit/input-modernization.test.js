'use strict';

var EventMap = require('../../dom-renderers/events/EventMap');
var GestureHandler = require('../../components/GestureHandler');

describe('input modernization', function() {
    it('registers pointer events alongside legacy mouse and touch events', function() {
        var registeredEvents = [];
        var node = {
            addComponent: function() {
                return 1;
            },
            addUIEvent: function(eventName) {
                registeredEvents.push(eventName);
            }
        };

        new GestureHandler(node);

        expect(registeredEvents).toEqual(expect.arrayContaining([
            'pointerdown',
            'pointermove',
            'pointerup',
            'pointercancel',
            'touchstart',
            'touchmove',
            'touchend',
            'mousedown',
            'mousemove',
            'mouseup',
            'mouseleave'
        ]));
    });

    it('tracks pointer identifiers through the gesture lifecycle', function() {
        var node = {
            addComponent: function() {
                return 1;
            },
            addUIEvent: function() {}
        };
        var handler = new GestureHandler(node);

        handler.on('drag', function() {});
        handler.onReceive('pointerdown', {
            pageX: 10,
            pageY: 20,
            pointerId: 7
        });

        expect(handler.trackedPointerIDs[0]).toBe(7);
        expect(handler.event.points).toBe(1);

        handler.onReceive('pointerup', {});

        expect(handler.trackedPointerIDs[0]).toBe(-1);
        expect(handler.trackedPointerIDs[1]).toBe(-1);
    });

    it('maps pointer and standard context menu events for DOM delegation', function() {
        expect(EventMap.pointerdown[1]).toBe(true);
        expect(EventMap.pointermove[1]).toBe(false);
        expect(EventMap.pointerup[1]).toBe(true);
        expect(EventMap.pointercancel[1]).toBe(true);
        expect(EventMap.contextmenu[1]).toBe(true);
        expect(EventMap.contextMenu[1]).toBe(true);
    });
});

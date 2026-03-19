'use strict';

var Scheduler = require('../../render-loops/Scheduler');
var renderLoops = require('../../render-loops');

describe('scheduler modernization', function() {
    it('exposes the shared scheduler from the render-loops namespace', function() {
        expect(renderLoops.Scheduler).toBe(Scheduler);
    });

    it('deduplicates updateables and dispatches normalized time', function() {
        var scheduler = new Scheduler();
        var updates = [];
        var updateable = {
            update: function(time) {
                updates.push(time);
            }
        };

        scheduler.update(updateable);
        scheduler.update(updateable);
        scheduler.step(12);
        scheduler.step(18);

        expect(updates).toEqual([12, 18]);
    });

    it('stops dispatching updates after deregistration', function() {
        var scheduler = new Scheduler();
        var updates = 0;
        var updateable = {
            update: function() {
                updates++;
            }
        };

        scheduler.update(updateable);
        scheduler.step(1);
        scheduler.noLongerUpdate(updateable);
        scheduler.step(2);

        expect(updates).toBe(1);
    });
});

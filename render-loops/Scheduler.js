/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Shared scheduler used by render loops to register updateables and dispatch
 * normalized frame times.
 *
 * @class Scheduler
 */
function Scheduler() {
    this._updates = [];
}

/**
 * Registers an updateable object if it has not been registered already.
 *
 * @method
 *
 * @param {Object} updateable object to be updated
 * @param {Function} updateable.update update function invoked by the scheduler
 *
 * @return {Scheduler} this
 */
Scheduler.prototype.update = function update(updateable) {
    if (this._updates.indexOf(updateable) === -1) {
        this._updates.push(updateable);
    }
    return this;
};

/**
 * Deregisters a previously registered updateable object.
 *
 * @method
 *
 * @param {Object} updateable updateable object previously registered with `update`
 *
 * @return {Scheduler} this
 */
Scheduler.prototype.noLongerUpdate = function noLongerUpdate(updateable) {
    var index = this._updates.indexOf(updateable);
    if (index > -1) {
        this._updates.splice(index, 1);
    }
    return this;
};

/**
 * Dispatches a normalized time value to all registered updateable objects.
 *
 * @method
 *
 * @param {Number} time normalized frame time
 *
 * @return {Scheduler} this
 */
Scheduler.prototype.step = function step(time) {
    for (var i = 0, len = this._updates.length ; i < len ; i++) {
        this._updates[i].update(time);
    }
    return this;
};

module.exports = Scheduler;

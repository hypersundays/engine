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

var MouseEvent = require('./MouseEvent');

/**
 * See [Pointer Events](https://www.w3.org/TR/pointerevents/).
 *
 * @class PointerEvent
 * @augments MouseEvent
 *
 * @param {Event} ev The native DOM event.
 */
function PointerEvent(ev) {
    MouseEvent.call(this, ev);

    /**
     * @name PointerEvent#pointerId
     * @type Number
     */
    this.pointerId = ev.pointerId;

    /**
     * @name PointerEvent#pointerType
     * @type String
     */
    this.pointerType = ev.pointerType;

    /**
     * @name PointerEvent#isPrimary
     * @type Boolean
     */
    this.isPrimary = ev.isPrimary;

    /**
     * @name PointerEvent#width
     * @type Number
     */
    this.width = ev.width;

    /**
     * @name PointerEvent#height
     * @type Number
     */
    this.height = ev.height;

    /**
     * @name PointerEvent#pressure
     * @type Number
     */
    this.pressure = ev.pressure;

    /**
     * @name PointerEvent#tangentialPressure
     * @type Number
     */
    this.tangentialPressure = ev.tangentialPressure;

    /**
     * @name PointerEvent#tiltX
     * @type Number
     */
    this.tiltX = ev.tiltX;

    /**
     * @name PointerEvent#tiltY
     * @type Number
     */
    this.tiltY = ev.tiltY;

    /**
     * @name PointerEvent#twist
     * @type Number
     */
    this.twist = ev.twist;
}

PointerEvent.prototype = Object.create(MouseEvent.prototype);
PointerEvent.prototype.constructor = PointerEvent;

/**
 * Return the name of the event type
 *
 * @method
 *
 * @return {String} Name of the event type
 */
PointerEvent.prototype.toString = function toString () {
    return 'PointerEvent';
};

module.exports = PointerEvent;

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

// @ts-check

'use strict';

/**
 * Deep clone an object.
 *
 * @method  clone
 *
 * @param {*} b            Object to be cloned.
 * @return {*} a           Cloned object (deep equality).
 */
var clone = function clone(b) {
    /** @type {any} */
    var a;
    if (typeof b === 'object') {
        a = (b instanceof Array) ? [] : {};
        for (var key in b) {
            if (typeof /** @type {any} */ (b)[key] === 'object' && /** @type {any} */ (b)[key] !== null) {
                if ((/** @type {any} */ (b)[key]) instanceof Array) {
                    a[key] = new Array((/** @type {any} */ (b)[key]).length);
                    for (var i = 0; i < (/** @type {any} */ (b)[key]).length; i++) {
                        a[key][i] = clone((/** @type {any} */ (b)[key][i]));
                    }
                }
                else {
                  a[key] = clone((/** @type {any} */ (b)[key]));
                }
            }
            else {
                a[key] = (/** @type {any} */ (b)[key]);
            }
        }
    }
    else {
        a = b;
    }
    return a;
};

module.exports = clone;

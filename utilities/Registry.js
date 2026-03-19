'use strict';

// @ts-check

/**
 * @class Registry
 * @template T
 */
function Registry () {
    /** @type {{ [key: string]: T | null }} */
    this._keyToValue = {};
    /** @type {Array<T | null>} */
    this._values = [];
    /** @type {Array<string | null>} */
    this._keys = [];
    /** @type {{ [key: string]: number | null | undefined }} */
    this._keyToIndex = {};
    /** @type {number[]} */
    this._freedIndices = [];
}

/**
 * @param {string} key
 * @param {T} value
 * @return {undefined}
 */
Registry.prototype.register = function register (key, value) {
    var index = this._keyToIndex[key];
    if (index == null) {
        var freedIndex = this._freedIndices.pop();
        var resolvedIndex = freedIndex == null ? this._values.length : freedIndex;

        this._values[resolvedIndex] = value;
        this._keys[resolvedIndex] = key;

        this._keyToIndex[key] = resolvedIndex;
        this._keyToValue[key] = value;
    }
    else {
        this._keyToValue[key] = value;
        this._values[index] = value;
    }
};

/**
 * @param {string} key
 * @return {undefined}
 */
Registry.prototype.unregister = function unregister (key) {
    var index = this._keyToIndex[key];

    if (index != null) {
        this._freedIndices.push(index);
        this._keyToValue[key] = null;
        this._keyToIndex[key] = null;
        this._values[index] = null;
        this._keys[index] = null;
    }
};

/**
 * @param {string} key
 * @return {T | null | undefined}
 */
Registry.prototype.get = function get (key) {
    return this._keyToValue[key];
};

/**
 * @return {Array<T | null>}
 */
Registry.prototype.getValues = function getValues () {
    return this._values;
};

/**
 * @return {Array<string | null>}
 */
Registry.prototype.getKeys = function getKeys () {
    return this._keys;
};

/**
 * @return {{ [key: string]: T | null }}
 */
Registry.prototype.getKeyToValue = function getKeyToValue () {
    return this._keyToValue;
};

module.exports = Registry;

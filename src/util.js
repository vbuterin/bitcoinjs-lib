var Crypto = require('./crypto-js/crypto');

/**
 * Cross-browser compatibility version of Array.isArray.
 */
exports.isArray = Array.isArray || function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

/**
 * Create a byte array representing a number with the given length
 */
exports.numToBytes = function(num, bytes) {
    if (bytes === undefined) bytes = 8;
    if (bytes === 0) return [];
    return [num % 256].concat(module.exports.numToBytes(Math.floor(num / 256), bytes - 1));
}

/**
 * Convert a byte array to the number that it represents
 */
exports.bytesToNum = function(bytes) {
    if (bytes.length === 0) return 0;
    return bytes[0] + 256 * module.exports.bytesToNum(bytes.slice(1));
}

/**
 * Turn an integer into a "var_int".
 *
 * "var_int" is a variable length integer used by Bitcoin's binary format.
 *
 * Returns a byte array.
 */
exports.numToVarInt = function(num) {
    if (num < 253) return [num];
    if (num < 65536) return [253].concat(exports.numToBytes(num, 2));
    if (num < 4294967296) return [254].concat(exports.numToBytes(num, 4));
    return [253].concat(exports.numToBytes(num, 8));
}

exports.bytesToWords = function (bytes) {
    var words = [];
    for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
    }
    return words;
}

exports.wordsToBytes = function (words) {
    var bytes = [];
    for (var b = 0; b < words.length * 32; b += 8) {
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
    }
    return bytes;
},

/**
 * Calculate RIPEMD160(SHA256(data)).
 *
 * Takes an arbitrary byte array as inputs and returns the hash as a byte
 * array.
 */
exports.sha256ripe160 = function (data) {
    return Crypto.RIPEMD160(Crypto.SHA256(data, {asBytes: true}), {asBytes: true});
}

exports.error = function(msg) {
    throw new Error(msg);
}

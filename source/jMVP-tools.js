/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param data {*} The data to iterate over
 * @param callback {Function} The callback function
 * @param [context] {{}} The object context used to run the callback in
 *
 * @example
 *
 * // Basic usage
 * jMVP.each(['a', 'b'], function(sValue, nIdx) {
 *      console.log(sValue);
 * });
 *
 * @example
 *
 * // Using the context parameter
 * function foo() {
 *
 *      this.log = function(sValue) {
 *          console.log(sValue);
 *      }
 *
 *      jMVP.each(['a', 'b'], function(sValue) {
 *          this.log(sValue);
 *      }, this);
 * }
 *
 */
jMVP.each = function(data, callback, context) {

    var key;

    if (data.constructor === Object && data.constructor !== Array) {

        for (key in data) {

            if (data.hasOwnProperty(key) && data[key]) {
                callback.apply(context, [key, data[key]]);
            }
        }

    } else if (typeof data === "string" || data instanceof Array) {

        (typeof data === "string" ? data.split("") : data).forEach(function(value, i) {
            callback.apply(context, [value, i]);
        });
    }
};

/**
 * Send a error message out
 * @param msg {String} Error message
 * @param type {Number} Error type
 */
jMVP.error = function(msg, type) {
    throw new Error(msg + ' - Error: ' + type);
};
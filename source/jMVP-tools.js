/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param vData {*} The data to iterate over
 * @param fCallback {Function} The callback function
 * @param [oContext] {{}} The object context used to run the callback in
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
jMVP.each = function(vData, fCallback, oContext) {

    var sKey;

    if (vData.constructor === Object && vData.constructor !== Array) {

        for (sKey in vData) {

            if (vData[sKey]) {
                fCallback.apply(oContext, [sKey, vData[sKey]]);
            }
        }

    } else if (typeof vData === "string" || vData instanceof Array) {

        (typeof vData === "string" ? vData.split("") : vData).forEach(function(vValue, nIdx) {
            fCallback.apply(oContext, [vValue, nIdx]);
        });
    }
};

/**
 * Send a error message out
 * @param sMessage {String} Error message
 * @param nType {Interger} Error type
 */
jMVP.error = function(sMessage, nType) {
    if (window.console && console.error) {
        console.error(sMessage, nType);
    } else {
        throw sMessage + '' + nType;
    }
};
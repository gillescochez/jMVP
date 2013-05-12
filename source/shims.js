/**
 * Array.prototype.forEach
 */
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function(action, that) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this) {
                action.call(that, this[i], i, this);
            }
        }
    };
};
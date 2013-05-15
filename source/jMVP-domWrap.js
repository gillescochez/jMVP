/**
 * Helper function which return a new instance of jMVP.dom.Wrap which allow chained method calls.
 *
 * @example
 *
 * var eNode = document.createElement('div');
 *
 * jMVP.dom(eNode).addClass('foo').on('click', function(oEvent) {
 *      // do something
 * });
 *
 * document.body.appendChild(eNode);
 *
 * @param vNodes {NodeList|Array} NodeList or array of nodes
 * @returns {jMVP.dom.Wrap} Class instance containing the nodes
 * @namespace
 */
jMVP.dom = function(vNodes) {
	return new jMVP.dom.Wrap(vNodes);
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation. It returns itself so that methods can be chained.
 * @param vNodes {NodeList|Array} NodeList or array of nodes
 * @prop aNodes {Array} Stored the nodes as an array
 * @returns {{}} Returns itself to allow chaining
 * @constructor
 */
jMVP.dom.Wrap = function(vNodes) {
	if (!vNodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.aNodes = vNodes[1] ? Array.prototype.slice.call(vNodes) : (vNodes[0] ? vNodes : [vNodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param fCallback {Function} Function to be called on each iteration
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.each = function(fCallback) {
	jMVP.each(this.aNodes, function(eNode) {
		fCallback.apply(eNode);
	});
	return this;
};

/**
 * Return a single element by class name
 * @param sClassName {String} CSS class reference
 * @returns {*}
 */
jMVP.dom.Wrap.prototype.getByClass = function(sClassName) {
    return jMVP.dom.getElementByClassName(sClassName, this.aNodes[0]);
};

/**
 * Bind a handler to elements
 * @param sEventType {String} The event type
 * @param fCallback {Function} Function to be called when the event is triggered
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.on = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.on(this, sEventType, fCallback);
    });
};

/**
 * Unbind a handler to the first element
 * @param sEventType {String} The type of the DOM event
 * @param fCallback {Function} Handling function for the event type
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.off = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.off(this, sEventType, fCallback);
    });
};

/**
 * Add a CSS class name to element(s)
 * @param sClassName {String} The class name to be added
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.addClass = function(sClassName) {
	return this.each(function() {
		this.className += ' ' + sClassName;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param sClassName {String} The class name to be removed
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.removeClass = function(sClassName) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + sClassName, 'gi'), '') : '';
	});
};

/**
 * Update the TEXT value of nodes
 * @param sValue {String} The TEXT string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.text = function(sValue) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = sValue;
	});
};

/**
 * Update the innerHTML of nodes
 * @param sValue {String}  The HTML string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.html = function(sValue) {
	return this.each(function() {
		this.innerHTML = sValue;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param sAttrKey {String} Attribute key
 * @param sAttrValue {String} Attribute value
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.setAttr = function(sAttrKey, sAttrValue) {
	return this.each(function() {
		this.setAttribute(sAttrKey, sAttrValue);
	});
};

/**
 * Remove a given attribute from nodes
 * @param sAttrKey {String} Attribute key
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.rmAttr = function(sAttrKey) {
	return this.each(function() {
		this.removeAttribute(sAttrKey);
	});
};


/**
 * Constants
 */

/**
 * Properties to simplify feature detection
 * @type {string}
 */
jMVP.dom.DIV = document.createElement('div');
jMVP.dom.INNER_TEXT = ('innerText' in jMVP.dom.DIV) ? 'innerText' : 'textContent';


/**
 * Static methods
 */

/**
 * Return a on (event bind) function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.on =  jMVP.dom.DIV.addEventListener
    ? function(eNode, sEventType, fCallback) {
        eNode.addEventListener(sEventType, fCallback, false);
    }
    : function(eNode, sEventType, fCallback) {
        eNode.attachEvent('on' + sEventType, fCallback);
    };

/**
 * Return a off (event unbind) function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.off =  jMVP.dom.DIV.removeEventListener
    ? function(eNode, sEventType, fCallback) {
        eNode.removeEventListener(sEventType, fCallback);
    }
    : function(eNode, sEventType, fCallback) {
        eNode.detachEvent('on' + sEventType, fCallback);
    };

/**
 * Return a getElementByClassName compatible with the browser used
 * @type {Function}
 */
jMVP.dom.getElementByClassName = jMVP.dom.DIV.querySelector
    ? function(sSelector, context) {
        return context.querySelector('.' + sSelector);
    }
    : function(sSelector, context) {
        var aResult = [];

        jMVP.dom(context.getElementsByTagName('*')).each(function() {
            if (this.className.indexOf(sSelector) !== -1) {
                aResult.push(this);
                return;
            }
        });

        return aResult[0];
    };


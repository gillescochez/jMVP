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
 * @param nodes {NodeList|Array} NodeList or array of nodes
 * @returns {jMVP.dom.Wrap} Class instance containing the nodes
 * @namespace
 */
jMVP.dom = function(nodes) {
	return new jMVP.dom.Wrap(nodes);
};

/**
 * Create a new DOM element and return it
 * @param [tag] {String} Tag name of the element
 * @returns {HTMLElement}
 */
jMVP.dom.createNode = function(tag) {
    return document.createElement(tag || 'div');
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation. It returns itself so that methods can be chained.
 * @param nodes {NodeList|Array} NodeList or array of nodes
 * @prop nodes {Array} Stored the nodes as an array
 * @returns {{}} Returns itself to allow chaining
 * @constructor
 */
jMVP.dom.Wrap = function(nodes) {
	if (!nodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.nodes = nodes[1] ? Array.prototype.slice.call(nodes) : (nodes[0] ? nodes : [nodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param callback {Function} Function to be called on each iteration
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.each = function(callback) {
	jMVP.each(this.nodes, function(node) {
		callback.apply(node);
	});
	return this;
};

/**
 * Bind a handler to elements
 * @param eventType {String} The event type
 * @param callback {Function} Function to be called when the event is triggered
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.on = function(eventType, callback) {
    return this.each(function() {
        jMVP.dom.on(this, eventType, callback);
    });
};

/**
 * Unbind a handler to the first element
 * @param eventType {String} The type of the DOM event
 * @param callback {Function} Handling function for the event type
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.off = function(eventType, callback) {
    return this.each(function() {
        jMVP.dom.off(this, eventType, callback);
    });
};

/**
 * Add a CSS class name to element(s)
 * @param name {String} The class name to be added
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.addClass = function(name) {
	return this.each(function() {
		this.className += ' ' + name;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param name {String} The class name to be removed
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.removeClass = function(name) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + name, 'gi'), '') : '';
	});
};

/**
 * Update the TEXT value of nodes
 * @param value {String} The TEXT string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.text = function(value) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = value;
	});
};

/**
 * Update the innerHTML of nodes
 * @param value {String}  The HTML string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.html = function(value) {
	return this.each(function() {
		this.innerHTML = value;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param key {String} Attribute key
 * @param value {String} Attribute value
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.setAttr = function(key, value) {
	return this.each(function() {
		this.setAttribute(key, value);
	});
};

/**
 * Remove a given attribute from nodes
 * @param key {String} Attribute key
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.rmAttr = function(key) {
	return this.each(function() {
		this.removeAttribute(key);
	});
};

/**
 * Show/Hide nodes using the display attribute. Default to show. Pass false argument to hide.
 * @param [yes] {Boolean} Pass as false to hide
 * @returns {Object}
 */
jMVP.dom.Wrap.prototype.display = function(yes) {
    var value = yes !== false ? '' : 'none';
    return this.each(function() {
        this.style.display = value;
    });
};

/**
 * HTML Element used to do feature detection
 * @type {Node}
 */
jMVP.dom.DIV = document.createElement('div');

/**
 * Return the supported insert text method by the browser as a string
 * @type {string}
 */
jMVP.dom.INNER_TEXT = ('innerText' in jMVP.dom.DIV) ? 'innerText' : 'textContent';

/**
 * Return a on (event bind) function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.on =  jMVP.dom.DIV.addEventListener
    ? function(node, eventType, callback) {
        node.addEventListener(eventType, callback, false);
    }
    : function(node, eventType, callback) {
        node.attachEvent('on' + eventType, callback);
    };

/**
 * Event unbinding function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.off =  jMVP.dom.DIV.removeEventListener
    ? function(node, eventType, callback) {
        node.removeEventListener(eventType, callback);
    }
    : function(node, eventType, callback) {
        node.detachEvent('on' + eventType, callback);
    };
/**
 * Helper function which return a new instance of jMVP.dom.Wrap
 * @param eNodes
 * @returns {jMVP.dom.Wrap}
 */
jMVP.dom = function(eNodes) {
	return new jMVP.dom.Wrap(eNodes);
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation
 * @param eNodes
 * @returns {*}
 * @constructor
 */
jMVP.dom.Wrap = function(eNodes) {
	if (!eNodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.aNodes = eNodes[1] ? Array.prototype.slice.call(eNodes) : (eNodes[0] ? eNodes : [eNodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param fCallback
 */
jMVP.dom.Wrap.prototype.each = function(fCallback) {
	jMVP.each(this.aNodes, function(eNode) {
		fCallback.apply(eNode);
	});
	return this;
};

/**
 * Return a getElementsByClassName compatible with the browser used
 */
jMVP.dom.getElementsByClassName = (function(div) {

    if (div.querySelectorAll) {
        return function(sSelector, context) {
            return context.querySelector('.' + sSelector);
        };
    } else {
        return function(sSelector, context) {
            var aResult = [];
            jMVP.dom(context.getElementsByTagName('*')).each(function() {
               if (this.className.indexOf(sSelector) !== -1)
               aResult.push(this);
            });
            return aResult;
        };
    }

})(document.createElement('div'));

/**
 * Return a single element by class name
 * @param sClassName
 * @returns {Node}
 */
jMVP.dom.Wrap.prototype.getByClass = function(sClassName) {
    return jMVP.dom.getElementsByClassName(sClassName, this.aNodes[0]);
};

/**
 * Add a CSS class name to element(s)
 * @param sClassName
 */
jMVP.dom.Wrap.prototype.addClass = function(sClassName) {
	return this.each(function() {
		this.className += ' ' + sClassName;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param sClassName
 */
jMVP.dom.Wrap.prototype.removeClass = function(sClassName) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + sClassName, 'gi'), '') : '';
	});
};

/**
 * Store property to use depending on the browser
 * @type {string}
 */
jMVP.dom.INNER_TEXT = ('innerText' in document.createElement('div')) ? 'innerText' : 'textContent';

/**
 * Update the TEXT value of nodes
 * @param sValue
 */
jMVP.dom.Wrap.prototype.text = function(sValue) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = sValue;
	});
};

/**
 * Update the innerHTML of nodes
 * @param sValue
 */
jMVP.dom.Wrap.prototype.html = function(sValue) {
	return this.each(function() {
		this.innerHTML = sValue;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param sAttrKey
 * @param sAttrValue
 */
jMVP.dom.Wrap.prototype.setAttr = function(sAttrKey, sAttrValue) {
	return this.each(function() {
		this.setAttribute(sAttrKey, sAttrValue);
	});
};

/**
 * Remove a given attribute from nodes
 * @param sAttrKey
 */
jMVP.dom.Wrap.prototype.rmAttr = function(sAttrKey) {
	return this.each(function() {
		this.removeAttribute(sAttrKey);
	});
};
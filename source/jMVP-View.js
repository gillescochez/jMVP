/**
 * jMVP View object constructor
 * @param oView Object representation of the view and its binding
 * @constructor
 */
jMVP.View = function(oView) {

	this.oRawView = oView;
	this.oMap = {};

	this.eDomView = jMVP.View.objectToElement(
		this.oRawView, this.oMap
	);
};

/**
 * Render the DOM view to a target DOM element
 * @param eTarget
 */
jMVP.View.prototype.render = function(eTarget) {
	eTarget.appendChild(this.eDomView);
	this.eDomView = eTarget.childNodes[eTarget.childNodes.length-1];
};

/**
 * Update elements which are affected by the value change
 * @param sReference
 * @param vValue
 */
jMVP.View.prototype.update = function(sReference, vValue) {
	jMVP.each(this.oMap[sReference], function(sHookKey, aElements) {
		jMVP.each(aElements, function(eElement) {
			jMVP.View.hooks[sHookKey](eElement, vValue);
		});
	});
	console.log(this.eDomView.innerHTML);
};

/**
 * Hooks storage for special view binding
 * @type {{text: Function, html: Function, visible: Function, attributes: Function, classNames: Function}}
 */
jMVP.View.hooks = {

	/**
	 * Update the body of the element with a string
	 * @param eTag
	 * @param sValue
	 */
	text: function(eTag, sValue) {
		// TODO add cross-browser support
		eTag.innerText = sValue;
	},

	/**
	 * Update the body of the element with a HTML sring
	 * @param eTag
	 * @param sValue
	 */
	html: function(eTag, sValue) {
		eTag.innerHTML = sValue;
	},

	// TODO leave in view?
	visible: function(eTag, bValue) {},

	// TODO special handling as value is object
	attributes: function(eTag, bValue) {},
	classNames: function(eTag, bValue) {}
};

/**
 * Convert an view object into DOM
 * @param oRawView
 * @param oMap
 * @param [eParentFragment]
 * @returns {DocumentFragment}
 */
jMVP.View.objectToElement = function(oRawView, oMap, eParentFragment) {

	// TODO try documentFragment approach - extra div is ugly :(
	var eFragment = eParentFragment || document.createElement('div');

	jMVP.each(oRawView, function(sKey, vValue) {

		var eTag = document.createElement(vValue.tag || 'div');

		// good idea?
		eTag.className = 'jmvp-' + sKey;

		// TODO is this needed?
//		if (jMVP.View.hooks[sKey]) {
//			jMVP.View.hooks[sKey](eTag, vValue);
//		}

		jMVP.each(jMVP.View.hooks, function(sHookKey) {

			// TODO add support for attributes/className as the value would be an object
			if (vValue[sHookKey]) {
				if (!oMap[vValue[sHookKey]]) oMap[vValue[sHookKey]] = {};
				if (!oMap[vValue[sHookKey]][sHookKey]) oMap[vValue[sHookKey]][sHookKey] = [];
				oMap[vValue[sHookKey]][sHookKey].push(eTag);
			}
		});

		if (jMVP.View.viewFragmentHasChildren(vValue)) {
			jMVP.View.objectToElement(vValue, oMap, eTag);
		}

		eFragment.appendChild(eTag);
	});

	return eFragment;
};

/**
 * Check a portion of a view object for children
 * @param oViewFragment
 * @returns {boolean}
 */
jMVP.View.viewFragmentHasChildren = function(oViewFragment) {

	var bReturn = false;

	jMVP.each(oViewFragment, function(sKey) {
		if (jMVP.View.hooks[sKey]) bReturn = false;
		else if (sKey === 'tag') bReturn = false;
		else bReturn = true;
	});

	return bReturn;
};
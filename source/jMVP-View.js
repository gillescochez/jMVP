/**
 * jMVP View object constructor
 * @param oView Object representation of the view and its binding
 * @constructor
 */
jMVP.View = function(oView) {
	this.oRawView = oView;
	this.eDomView = jMVP.View.objectToElement(this.oRawView);
	console.log(this.eDomView);
};

/**
 * Convert an view object into DOM
 * @param oRawView
 * @param eParentFragment
 * @returns {DocumentFragment}
 */
jMVP.View.objectToElement = function(oRawView, eParentFragment) {

	var eFragment = eParentFragment || document.createDocumentFragment();

	jMVP.each(oRawView, function(sKey, vValue) {

		var eTag = document.createElement(vValue.tag || 'div');

		// good idea?
		eTag.className = 'jMVP-' + sKey;

		if (jMVP.View.hooks[sKey]) {
			jMVP.View.hooks[sKey](eTag, vValue);
		} else {
			if (jMVP.View.viewFragmentHasChildren(vValue)) {
				jMVP.View.objectToElement(vValue, eTag);
			}
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

	jMVP.each(oViewFragment, function(sKey, vValue) {

		// hook = no children
		if (jMVP.View.hooks[sKey]) bReturn = false;

		// tag = no children
		else if (sKey === 'tag') bReturn = false;

		else bReturn = true;

	});

	return bReturn;
};

/**
 * Hooks storage for special view binding
 * @type {{text: Function, html: Function, visible: Function, attributes: Function, classNames: Function}}
 */
jMVP.View.hooks = {
	text: function(eTag) {},
	html: function(eTag) {},
	visible: function(eTag) {},
	attributes: function(eTag) {},
	classNames: function(eTag) {}
};


/*

function eachRecursive(obj) {
	for (var k in obj) {

		if (typeof obj[k] == "Object")
			eachRecursive(obj[k]);
		else
			// do something...
	}
};

this.eDomView = objectToElement(oRawView);

objectToElement = function(oRawView) {

	var sKey, oValue, eTag,
		eFragment = document.createFragment();

	for (sKey in oRawView) {

		oValue = oRawView[sKey];
		eTag = document.createElement(oValue.tag || 'div');
		eTag.className = 'jMVP-' + sKey;

		eFragment.appendChild(eTag);

		for (var prop in oValue) {

			if (hooks[prop]) hooks[prop](eTag);
			else eTag.appendChild(objectToElement(prop));
		};

	}

	return eElement;
};

*/
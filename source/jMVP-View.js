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

	jMVP.each(this.oMap[sReference], function(sHookKey, vHookConfig) {

		if (sHookKey === 'attributes' || sHookKey === 'classNames') {

			jMVP.each(vHookConfig, function(sKey, aNodes) {
				jMVP.View.hooks[sHookKey](aNodes, vValue, sKey);
			});

		} else {
			
			jMVP.View.hooks[sHookKey](vHookConfig, vValue);
		}

	}, this);
};

/**
 * Hooks storage for special view binding
 * @type {{text: Function, html: Function, visible: Function, attributes: Function, classNames: Function}}
 */
// TODO add cross-browser support
jMVP.View.hooks = {

	/**
	 * Text update hook
	 * @param aNodes
	 * @param sValue
	 */
	text: function(aNodes, sValue) {
		jMVP.dom(aNodes).text(sValue);
	},

	/**
	 * HTML update hook
	 * @param aNodes
	 * @param sValue
	 */
	html: function(aNodes, sValue) {
		jMVP.dom(aNodes).html(sValue);
	},

	// TODO leave in view?
	visible: function(aNodes, bValue) {},

	/**
	 * Attributes update hook
	 * @param aNodes
	 * @param vValue
	 * @param sAttrKey
	 */
	attributes: function(aNodes, vValue, sAttrKey) {
		//TODO remove when undefined or null???
		jMVP.dom(aNodes)[(vValue === false || vValue === null ? 'rm' : 'set') + 'Attr'](sClassName, sAttrKey);
	},

	/**
	 * CSS classes update hook
	 * @param aNodes
	 * @param bValue
	 * @param sClassName
	 */
	classNames: function(aNodes, bValue, sClassName) {
		jMVP.dom(aNodes)[(bValue === true ? 'add' : 'remove') + 'Class'](sClassName);
	}
};

/**
 * Convert an view object into DOM
 * @param oRawView
 * @param oMap
 * @param [eParentFragment]
 * @returns {DocumentFragment}
 */
//TODO refactoring, method is too long and doing too much stuff
jMVP.View.objectToElement = function(oRawView, oMap, eParentFragment) {

	// TODO try documentFragment approach - extra div is ugly :(
	var eFragment = eParentFragment || document.createElement('div');

	jMVP.each(oRawView, function(sKey, vValue) {

		var eTag = document.createElement(vValue.tag || 'div');

		// good idea?
		eTag.className = 'jmvp-' + sKey;

		// TODO is this needed? Think so if Hooks set on view object's root
//		if (jMVP.View.hooks[sKey]) {
//			jMVP.View.hooks[sKey](eTag, vValue);
//		}

		jMVP.each(jMVP.View.hooks, function(sHookKey) {

			if (vValue[sHookKey]) {

				// Handle attributes and classNames objects
				if (sHookKey === 'attributes' || sHookKey === 'classNames') {

					jMVP.each(vValue[sHookKey], function(sKey, sValue) {
						if (!oMap[sValue]) oMap[sValue] = {};
						if (!oMap[sValue][sHookKey]) oMap[sValue][sHookKey] = {};
						if (!oMap[sValue][sHookKey][sKey]) oMap[sValue][sHookKey][sKey] = [];
						oMap[sValue][sHookKey][sKey].push(eTag);
					});

				} else {
					if (!oMap[vValue[sHookKey]]) oMap[vValue[sHookKey]] = {};
					if (!oMap[vValue[sHookKey]][sHookKey]) oMap[vValue[sHookKey]][sHookKey] = [];
					oMap[vValue[sHookKey]][sHookKey].push(eTag);
				}
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
		bReturn = !(jMVP.View.hooks[sKey] || sKey === 'tag');
	});

	return bReturn;
};
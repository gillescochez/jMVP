/**
 * jMVP View object constructor
 *
 * @prop oConfig {Object} Original view object configuration
 * @prop oMap {Object} Map of elements which depends on hooks/data update
 * @prop eDomView {Node} The DOM representation of the view
 *
 * @param oConfig {Object} Representation of the view and its binding
 *
 * @example
 * var oViewConfig = {
 *      header: {
 *          text: 'Hello'
 *      }
 * };
 *
 * var oView = new jMVP.View(oViewConfig);
 *
 * @constructor
 */
jMVP.View = function(oConfig) {

	this.oConfig = oConfig;
	this.oMap = {};

	this.eDomView = jMVP.View.parseObject(
		this.oConfig, this.oMap
	);
};

/**
 * Render the DOM view to a target DOM element
 * @param eTarget {Node} The DOM element targeted
 */
jMVP.View.prototype.render = function(eTarget) {
	eTarget.appendChild(this.eDomView);
	this.eDomView = eTarget.childNodes[eTarget.childNodes.length-1];
};

/**
 * Update elements which are affected by the value change
 * @param sReference {String} Model key
 * @param vValue {*} Value to be used in hooks
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
 * Config object getter
 */
jMVP.View.prototype.getConfig = function() {
    return this.oConfig;
};

/**
 * Map object getter
 */
jMVP.View.prototype.getMap = function() {
    return this.oMap;
};

/**
 * Check if a key is in the map
 * @param sKey
 * @returns {boolean}
 */
jMVP.View.prototype.isInMap = function(sKey) {
    return this.oMap[sKey] ? true : false;
};

/**
 * Hooks storage for special view binding
 * @namespace
 * @type {{text: Function, html: Function, visible: Function, attributes: Function, classNames: Function}}
 */
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

	/**
	 * Attributes update hook
	 * @param aNodes
	 * @param vValue
	 * @param sAttrKey
	 */
	attributes: function(aNodes, vValue, sAttrKey) {
		//TODO remove when undefined or null???
		jMVP.dom(aNodes)[(vValue === false || vValue === null ? 'rm' : 'set') + 'Attr'](sAttrKey, vValue);
	},

	/**
	 * CSS classes update hook
	 * @param aNodes
	 * @param bValue
	 * @param sClassName
	 */
	classNames: function(aNodes, bValue, sClassName) {
		jMVP.dom(aNodes)[(bValue ? 'add' : 'remove') + 'Class'](sClassName);
	}
};

/**
 * Convert an view object into DOM
 * @param oRawView
 * @param oMap
 * @param [eParentFragment]
 * @returns {DocumentFragment}
 */
jMVP.View.parseObject = function(oRawView, oMap, eParentFragment) {

	// TODO try documentFragment approach - extra div is ugly :(
	var eView = eParentFragment || document.createElement('div');

	jMVP.each(oRawView, function(sKey, vValue) {

		var eNode = document.createElement(vValue.tag || 'div');

		eNode.className = jMVP.CSS_PREFIX + sKey;

        jMVP.View.parseHooks(oMap, sKey, vValue, eNode);

		vValue.children && jMVP.View.parseObject(vValue.children, oMap, eNode);

		eView.appendChild(eNode);
	});

	return eView;
};

/**
 * Parse hooks inside the View configuration object
 * @param oMap
 * @param sKey
 * @param oConfig
 * @param oNode
 */
jMVP.View.parseHooks = function(oMap, sKey, oConfig, oNode) {

    jMVP.each(jMVP.View.hooks, function(sHookKey) {

        if (oConfig[sHookKey]) {

            // Handle attributes and classNames objects
            if (sHookKey === 'attributes' || sHookKey === 'classNames') {

                jMVP.each(oConfig[sHookKey], function(sKey, sValue) {
                    if (!oMap[sValue]) oMap[sValue] = {};
                    if (!oMap[sValue][sHookKey]) oMap[sValue][sHookKey] = {};
                    if (!oMap[sValue][sHookKey][sKey]) oMap[sValue][sHookKey][sKey] = [];
                    oMap[sValue][sHookKey][sKey].push(oNode);
                });

            } else {

                if (!oMap[oConfig[sHookKey]]) oMap[oConfig[sHookKey]] = {};
                if (!oMap[oConfig[sHookKey]][sHookKey]) oMap[oConfig[sHookKey]][sHookKey] = [];
                oMap[oConfig[sHookKey]][sHookKey].push(oNode);
            }
        }
    });
};
/**
 * jMVP View object constructor
 *
 * @prop oConfig {Object} Original view object configuration
 * @prop oMap {Object} Map used for handling the update process
 * @prop eDomView {Node} The DOM representation of the view
 * @prop oNodesMap {Object} Object to store nodes for quick access
 * @prop oLoopMap {Object} Map used for the handling of loops inside the views
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
    this.oNodesMap = {};
    this.oLoopMap = {};
	this.eDomView = this.generate(oConfig);
};

/**
 * Update elements which are affected by the value change
 * @param sReference {String} Model key
 * @param vValue {*} Value to be used in hooks
 */
jMVP.View.prototype.update = function(sReference, vValue) {

    jMVP.each(this.oMap[sReference], function(sHookKey, vHookConfig) {

        if (sHookKey == 'attributes' || sHookKey == 'classNames') {

            jMVP.each(vHookConfig, function(sKey, aNodes) {
                jMVP.View.hooks[sHookKey](aNodes, vValue, sKey);
            });

        } else {

            jMVP.View.hooks[sHookKey](vHookConfig, vValue);
        }

    }, this);
};

/**
 * Generate the map and the element necessary to generate the UI (DOM)
 * @param oConfig
 * @param [eParentNode]
 * @returns {HTMLElement}
 */
jMVP.View.prototype.generate = function(oConfig, eParentNode) {

    // TODO try documentFragment approach - extra div is ugly :(
    var eView = eParentNode || document.createElement('div');

    jMVP.each(oConfig, function(sKey, vValue) {

        var eNode = document.createElement(vValue.tag || 'div');

        this.oNodesMap[sKey] = eNode;

        eNode.className = sKey;

        // handle hooks
        this.mapHooks(sKey, vValue, eNode);

        // handle loops
        vValue.loop && this.mapLoop(sKey, vValue.loop, eNode);

        // handle children
        vValue.children && this.generate(vValue.children, eNode);

        eView.appendChild(eNode);

    }, this);

    return eView;
};

/**
 * Map hooks to oMap
 * @param sKey {String} Key reference
 * @param oConfig {Object} Hooks config
 * @param eNode {HTMLElement}
 */
jMVP.View.prototype.mapHooks = function(sKey, oConfig, eNode) {

    jMVP.each(jMVP.View.hooks, function(sHookKey) {

        if (oConfig[sHookKey]) {

            // Handle attributes and classNames objects
            if (sHookKey === 'attributes' || sHookKey === 'classNames') {

                jMVP.each(oConfig[sHookKey], function(sKey, sValue) {
                    if (!this.oMap[sValue]) this.oMap[sValue] = {};
                    if (!this.oMap[sValue][sHookKey]) this.oMap[sValue][sHookKey] = {};
                    if (!this.oMap[sValue][sHookKey][sKey]) this.oMap[sValue][sHookKey][sKey] = [];
                    this.oMap[sValue][sHookKey][sKey].push(eNode);
                }, this);

            } else {

                if (!this.oMap[oConfig[sHookKey]]) this.oMap[oConfig[sHookKey]] = {};
                if (!this.oMap[oConfig[sHookKey]][sHookKey]) this.oMap[oConfig[sHookKey]][sHookKey] = [];
                this.oMap[oConfig[sHookKey]][sHookKey].push(eNode);
            }
        }
    }, this);
};

/**
 * Map loops object to oLoopMap
 * @param sKey {String} Key reference
 * @param oConfig {Object} Loop configuration object
 * @param eNode {HTMLElement}
 */
jMVP.View.prototype.mapLoop = function(sKey, oConfig, eNode) {

    if (!oConfig.source || !oConfig.template) {
        jMVP.error('View loop object require both a source and template');
    }

    this.oLoopMap[sKey] = {
        config: oConfig,
        node: eNode
    };
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
 * Config object getter
 * @returns {Object}
 */
jMVP.View.prototype.getConfig = function() {
    return this.oConfig;
};

/**
 * Map object getter
 * @returns {Object}
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
 * DOM getter
 * @param sKey
 * @returns {HTMLElement}
 */
jMVP.View.prototype.getElement = function(sKey) {
    return this.oNodesMap[sKey] || null;
};

/**
 * DOM getter
 * @returns {HTMLElement}
 */
jMVP.View.prototype.getDOM = function() {
    return this.eDomView;
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
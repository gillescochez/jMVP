/**
 * Create a new jMVP.View instance
 *
 * @prop oConfig {Object} Store the original config object
 * @prop oNodeMap {Object} Node map of created element for fast access
 * @prop oLoopMap {Object} Store loop configuration object
 * @prop oRefMap {Object} Store hooks and data relationships
 * @prop eDomView {HTMLElement} The DOM equivalent of the view
 *
 * @param oConfig {Object} View configuration
 * @param bAutoParse {Boolean} If true the View will parse
 * @constructor
 */
jMVP.View = function(oConfig, bAutoParse) {

    if (!oConfig) {
        jMVP.error('jMVP.View: Configuration object missing!', 101);
        return;
    }

    this.oConfig = oConfig;
    this.oNodeMap = {};
    this.oLoopMap = {};
    this.oRefMap = {};
    this.eDomView = jMVP.View.emptyDomView(oConfig);

    if (bAutoParse) this.parse();
};

/**
 * Recursively parse the configuration object and generate nodes,
 * ref based and loop based maps.
 * @param [oConfig] {Object} Used if present instead of the instance oConfig
 * @param [eParentNode] {HTMLElement} Parent to add element node into
 */
jMVP.View.prototype.parse = function(oConfig, eParentNode) {

    jMVP.each(oConfig || this.oConfig, function(sElementId, oItemConfig) {

        var eNode = this.createNode(sElementId, oItemConfig.tag);
        this.storeNode(sElementId, eNode);

        (eParentNode || this.eDomView).appendChild(eNode);

        oItemConfig.children && this.parse(oItemConfig.children, eNode);

        oItemConfig.hook && this.hook(oItemConfig.hook, eNode);

        oItemConfig.loop && this.storeLoop(oItemConfig.loop, eNode);

    }, this);
};

/**
 * Update the view with the new value for a given reference
 * @param sReference {String} Reference used with the hook
 * @param vValue {*} The new value
 */
jMVP.View.prototype.update = function(sReference, vValue) {

    if (this.oRefMap[sReference]) {

        if (typeof vValue == 'string' || vValue.constructor == Boolean) {
            this.applyHooks(sReference, vValue);
        }

        if (vValue.constructor == Array) {
            this.applyHooks(sReference, vValue.join(', '));
        }
    }

    if (this.oLoopMap[sReference]) {
        this.loop(sReference, vValue);
    }
};

/**
 * Execute a loop config, called on update affecting loops
 * @param sReference {String} Data source reference
 * @param vValue {*}
 */
jMVP.View.prototype.loop = function(sReference, vValue) {

    var nValueLen = vValue.length;

    jMVP.each(this.oLoopMap[sReference], function(oLoopConfig) {

        jMVP.each(oLoopConfig.template, function(sItemKey, oTemplateItemConfig) {

            var aNodes = this.oNodeMap[sItemKey],
                nNodesLen = aNodes ? aNodes.length : 0,
                nNodesCount = 0;

            if (nNodesLen === 0) {

                nNodesCount = nValueLen;

            } else if (nNodesLen !== nValueLen) {

                if (nNodesLen < nValueLen) {

                    nNodesCount = nValueLen - nNodesLen;

                } else {

                }
            }

            this.doNodes(nNodesCount, oTemplateItemConfig.tag, sItemKey);
            aNodes = this.oNodeMap[sItemKey];

            jMVP.each(aNodes, function(eNode) {
                oLoopConfig.parent.appendChild(eNode)
            }, this);

//            this.applyHooks(sReference, vValue);

            console.log(aNodes);

        }, this);

//        var oTemplate = oLoopConfig.template,
//            sSource = oLoopConfig.source,
//            aNodes = this.oNodeMap[sReference],
//            nNodesLen = aNodes ? aNodes.length : 0,
//            nNodesCount = 0;
//
//        if (nNodesLen === 0) {
//
//            nNodesCount = nValueLen;
//
//        } else if (nNodesLen !== nValueLen) {
//
//            if (nNodesLen < nValueLen) {
//
//                nNodesCount = nValueLen - nNodesLen;
//
//            } else {
//
//            }
//        }
//
//        this.doNodes(nNodesCount, oTemplate.tag, sReference);
//        aNodes = this.oNodeMap[sReference];

//        this.applyHooks(sSource, vValue);


//        var aNodes = this.doLoopNodes(oLoopConfig, vValue);

//        console.log(aNodes);


    }, this);

    // loop through loop config attach to the reference
        // using the source check if some element exists already
            // if they do
                // we just do the minimum required
                // same count as value count use same element
                // less remove some
                // more add some

            //if they don't
                // build element for each iteration
        // render elements
        // apply hooks to each element or apply hook then render?
};

jMVP.View.prototype.doNodes = function(nCount, sTag, sReference) {

    var i = 0;

    for (; i < nCount; i++) {

        var eNode = this.createNode(sReference, sTag);
        this.storeNode(sReference, eNode);
    }
};

/**
 * Store a configuration loop object inside the loop map object
 * @param oLoopConfig {Object} Loop configuration object
 * @param eParentNode {HTMLElement} The container for the loop
 */
jMVP.View.prototype.storeLoop = function(oLoopConfig, eParentNode) {

    // TODO handle case where source isn't defined.
    var sSource = oLoopConfig.source;

    oLoopConfig.parent = eParentNode;

    if (!this.oLoopMap[sSource]) this.oLoopMap[sSource] = [];
    this.oLoopMap[sSource].push(oLoopConfig);
};

/**
 * Handle the hook object for a given node
 * @param oHookConfig {Object} Hook configuration object
 * @param eNode {HTMLElement} Node currently targeted
 */
jMVP.View.prototype.hook = function(oHookConfig, eNode) {
    jMVP.each(oHookConfig, function(sHook, vValue) {
        jMVP.View.hooks[sHook] && this.storeHook(eNode, sHook, vValue);
    }, this);
};

/**
 * Store hook configuration
 * @param eNode {HTMLElement} The node targeted
 * @param sHook {String} The hook name
 * @param vValue {String|Object} Only an object for attr and css hooks
 */
jMVP.View.prototype.storeHook = function(eNode, sHook, vValue) {

    if (typeof vValue == 'string') {

        if (!this.oRefMap[vValue]) this.oRefMap[vValue] = {};
        if (!this.oRefMap[vValue][sHook]) this.oRefMap[vValue][sHook] = [];
        this.oRefMap[vValue][sHook].push(eNode);

    } else {

        jMVP.each(vValue, function(sKey, sValue) {
            if (!this.oRefMap[sValue]) this.oRefMap[sValue] = {};
            if (!this.oRefMap[sValue][sHook]) this.oRefMap[sValue][sHook] = {};
            if (!this.oRefMap[sValue][sHook][sKey]) this.oRefMap[sValue][sHook][sKey] = [];
            this.oRefMap[sValue][sHook][sKey].push(eNode);
        }, this);
    }
};

/**
 * Apply hooks to nodes stored under the given reference
 * @param sReference {String} Value reference mapped to nodes
 * @param vValue {*} The value used by the hooks
 */
jMVP.View.prototype.applyHooks = function(sReference, vValue) {

    jMVP.each(this.oRefMap[sReference], function(sHook, vHook) {

        // text, html, display
        if (vHook[0]) {

            jMVP.View.hooks[sHook](vHook, vValue);

            // css, attr
        } else {
            jMVP.each(vHook, function(sKey, aNodes) {
                jMVP.View.hooks[sHook](aNodes, sKey, vValue);
            });
        }
    });
};

/**
 * Create a new dom element and store it in the node map
 * @param sElementId {String} Id reference in the view used as className
 * @param [sTagName] {String} Tag name to use to create the new element
 */
jMVP.View.prototype.createNode = function(sElementId, sTagName) {

    var eNode = jMVP.dom.createNode(sTagName);
    eNode.className = sElementId;
    return eNode;
};

/**
 * Store a node to the node map property
 * @param sNodeId {String} Node reference
 * @param eNode {HTMLElement} The node
 */
jMVP.View.prototype.storeNode = function(sNodeId, eNode) {

    if (!this.oNodeMap[sNodeId]) this.oNodeMap[sNodeId] = eNode;
    else {
        if (this.oNodeMap[sNodeId].constructor != Array) {
            var eExistingNode = this.oNodeMap[sNodeId];
            this.oNodeMap[sNodeId] = [];
            this.oNodeMap[sNodeId].push(eExistingNode);
        }
        this.oNodeMap[sNodeId].push(eNode);
    }
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
 * Check if a node key id is in the map
 * @param sNodeId
 * @returns {boolean}
 */
jMVP.View.prototype.isInMap = function(sNodeId) {
    var vIsIn = this.oMap[sNodeId] || this.oLoopMap[sNodeId] || null;
    return vIsIn ? true : false;
};

/*************** Getters ***************/

jMVP.View.prototype.getConfig = function() {
    return this.oConfig;
};

jMVP.View.prototype.getNodeMap = function() {
    return this.oNodeMap;
};

jMVP.View.prototype.getNode = function(sNodeId) {
    return this.oNodeMap[sNodeId] || null;
};

jMVP.View.prototype.getLoopMap = function() {
    return this.oLoopMap;
};

jMVP.View.prototype.getRefMap = function() {
    return this.oRefMap;
};

jMVP.View.prototype.getDomView = function() {
    return this.eDomView;
};

/*************** Hooks ***************/

/**
 * Hooks storage for special view binding
 * @namespace
 * @type {{text: Function, html: Function, visible: Function, attributes: Function, classNames: Function}}
 */
jMVP.View.hooks = {

    /**
     * Text update hook
     * @param aNodes {Array} Array of nodes
     * @param sValue {String} Value to be set as text
     */
    text: function(aNodes, sValue) {
        jMVP.dom(aNodes).text(sValue);
    },

    /**
     * HTML update hook
     * @param aNodes {Array} Array of nodes
     * @param sValue
     */
    html: function(aNodes, sValue) {
        jMVP.dom(aNodes).html(sValue);
    },

    /**
     * Attributes update hook
     * @param aNodes {Array} Array of nodes
     * @param vValue
     * @param sAttrKey
     */
    attr: function(aNodes, sAttrKey, vValue) {
        jMVP.dom(aNodes)[(vValue === false || vValue === null ? 'rm' : 'set') + 'Attr'](sAttrKey, vValue);
    },

    /**
     * CSS classes update hook
     * @param aNodes {Array} Array of nodes
     * @param bValue {Boolean} Decide if we remove or add the class name
     * @param sClassName {String} CSS class name
     */
    css: function(aNodes, sClassName, bValue) {
        jMVP.dom(aNodes)[(bValue ? 'add' : 'remove') + 'Class'](sClassName);
    },

    /**
     * Show/Hide an element using the display property
     * @param aNodes {Array} Array of nodes
     * @param [bValue] {Boolean}
     */
    display: function(aNodes, bValue) {
        jMVP.dom(aNodes).display(bValue);
    }
};


/**
 * Static method creating a new empty dom view based on a view config.
 * Support custom id/tag/className, those options are delete from the config object after use.
 * @param oConfig {Object} View configuration object
 */
jMVP.View.emptyDomView = function(oConfig) {

    var eDomView;

    if (oConfig.tag) {
        eDomView = jMVP.dom.createNode(oConfig.tag);
        delete oConfig.tag;
    } else {
        eDomView = jMVP.dom.createNode();
    }

    if (oConfig.id) {
        eDomView.id = oConfig.id;
        delete oConfig.id;
    }

    if (oConfig.className) {
        eDomView.className = oConfig.className;
        delete oConfig.className;
    }

    return eDomView;
};
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
 * @constructor
 */
jMVP.View = function(oConfig) {

    (!oConfig) && jMVP.error('jMVP.View: Configuration object missing!', 101);

    this.oConfig = oConfig;
    this.oNodeMap = {};
    this.oLoopMap = {};
    this.oRefMap = {};

    this.eDomView = jMVP.dom.create();
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

        // TODO handle this view jMVP.dom
        (eParentNode || this.eDomView).appendChild(eNode);

        oItemConfig.children && this.parse(oItemConfig.children, eNode);

        oItemConfig.hook && this.hook(oItemConfig.hook, eNode);

    }, this);
};

/**
 * Handle the hook object for a given node
 * @param oHookConfig {Object} Hook configuration object
 * @param eNode {HTMLElement} Node currently targeted
 */
jMVP.View.prototype.hook = function(oHookConfig, eNode) {
    jMVP.each(oHookConfig, function(sHook, vValue) {
        if (jMVP.View.hooks[sHook]) {
            console.log(eNode, sHook, vValue);
            this.storeHook(eNode, sHook, vValue);
        }
    }, this);
};

/**
 * Store hook configuration
 * @param eNode {HTMLElement} The node targeted
 * @param sHook {String} The hook name
 * @param vValue {String|Object} Only an object for attr and css hooks
 */
jMVP.View.prototype.storeHook = function(eNode, sHook, vValue) {

    // TODO tests
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
 * Create a new dom element and store it in the node map
 * @param sElementId {String} Id reference in the view used as className
 * @param [sTagName] {String} Tag name to use to create the new element
 */
jMVP.View.prototype.createNode = function(sElementId, sTagName) {

    var eNode = jMVP.dom.create(sTagName);
    // TODO handle via jMVP.dom when addClass doesn't use space is className is empty string
    eNode.className = sElementId;
    return eNode;
};


/**
 * Store a node to the node map property
 * @param sElementId {String} Node reference
 * @param eNode {HTMLElement} The node
 */
jMVP.View.prototype.storeNode = function(sElementId, eNode) {

    if (!this.oNodeMap[sElementId]) {
        this.oNodeMap[sElementId] = [];
    }

    this.oNodeMap[sElementId].push(eNode);
};

/*************** Getters & Setters ***************/

jMVP.View.prototype.getConfig = function() {
    return this.oConfig;
};

jMVP.View.prototype.getNodeMap = function() {
    return this.oNodeMap;
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
     * @param aNodes {Array} Array of node
     * @param vValue
     * @param sAttrKey
     */
    attr: function(aNodes, vValue, sAttrKey) {
        //TODO remove when undefined or null???
        jMVP.dom(aNodes)[(vValue === false || vValue === null ? 'rm' : 'set') + 'Attr'](sAttrKey, vValue);
    },

    /**
     * CSS classes update hook
     * @param aNodes {Array} Array of node
     * @param bValue {Boolean} Decide if we remove or add the class name
     * @param sClassName {String} CSS class name
     */
    css: function(aNodes, bValue, sClassName) {
        jMVP.dom(aNodes)[(bValue ? 'add' : 'remove') + 'Class'](sClassName);
    }
};
/*
    Stuff it needs

        Rename classNames property to css (css should always be class based anyway)

        Global config object parsing method
            Store in oMap like before (look for cleaner structure or have oMapAttribute, oMapCSS)
            - parser method
                - parse()
                - parseLoop()
                - storeHooks()

        Recursive DOM generation method
            - Only handle DOM creation nothing else
                - generateHtml(oView, [eParent])
                - createNode(sId, oConfig);

        Fast access / return of DOM element
            - Using the current oNodesMap
                - getNodeByRef(sReference)
                - getNodes()

        Apply hooks
            - applyToRef(sReference)
            - applyAll()

        Looping
            - handle children inside loops
            - handle external data (not the actual loop data)
            - handle loop data in a clean way

        Updating
            Store in oMapLoop for easily checking if data used by a loop
            - handle string with hooks
            - handle array/object with loop handler if used by any loop config
            - stringify array/object with NO config loop

        Hooks
            - text
            - html
            - css
            - visible
            - attr

*/
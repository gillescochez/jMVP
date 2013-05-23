/**
 * Create a new jMVP.View instance
 *
 * @prop oConfig {Object}
 * @prop oNodeMap {Object}
 * @prop oLoopMap {Object}
 * @prop oRefMap {Object}
 * @prop eDomView {HTMLElement}
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

jMVP.View.prototype.hook = function(oHookConfig, eNode) {

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
    attr: function(aNodes, vValue, sAttrKey) {
        //TODO remove when undefined or null???
        jMVP.dom(aNodes)[(vValue === false || vValue === null ? 'rm' : 'set') + 'Attr'](sAttrKey, vValue);
    },

    /**
     * CSS classes update hook
     * @param aNodes
     * @param bValue
     * @param sClassName
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
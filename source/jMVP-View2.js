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
 */
jMVP.View.prototype.parse = function(oConfig) {

    jMVP.each(oConfig || this.oConfig, function(sElementId, oItemConfig) {

        this.createNode(sElementId, oItemConfig.tag);

    }, this);
};

/**
 * Create a new dom element and store it in the node map
 * @param sElementId {String} Id reference in the view used as className
 * @param [sTagName] {String} Tag name to use to create the new element
 */
jMVP.View.prototype.createNode = function(sElementId, sTagName) {

    var eNode = jMVP.dom.create(sTagName);
    eNode.className = sElementId;

    this.storeNode(sElementId, eNode);
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

/**
 * Return the view instance configuration object
 * @returns {Object}
 */
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
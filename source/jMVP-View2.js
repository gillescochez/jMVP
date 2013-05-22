/**
 * Create a new jMVP.View instance
 * @param oConfig {Object} View configuration
 * @constructor
 */
jMVP.View = function(oConfig) {

    if (!oConfig) {
        jMVP.error('jMVP.View: Configuration object missing!', 101);
    }

    this.oConfig = oConfig;
    this.oNodeMap = {};
    this.oLoopMap = {};
    this.oRefMap = {};
};

/**
 * Parse the configuration object and generate nodes, ref based and loop based maps.
 */
jMVP.View.prototype.parse = function(oConfig) {

    jMVP.each((oConfig || this.oConfig), function(sReference, oItemConfig) {



    }, this)
};




/***** Getters & Setters *****/

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
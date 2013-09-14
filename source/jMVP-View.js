/**
 * Create a new jMVP.View instance
 *
 * @prop config {Object} Store the original config object
 * @prop oNodeMap {Object} Node map of created element for fast access
 * @prop oLoopMap {Object} Store loop configuration object
 * @prop oRefMap {Object} Store hooks and data relationships
 * @prop eDomView {HTMLElement} The DOM equivalent of the view
 *
 * @param config {Object} View configuration
 * @param parse {Boolean} If true the View will parse
 * @constructor
 */
jMVP.View = function(config, parse) {

    if (!config) {
        jMVP.error('jMVP.View: Configuration object missing!', 101);
        return;
    }

    this.config = config;
    this.nodeMap = {};
    this.loopMap = {};
    this.refMap = {};
    this.domView = jMVP.View.emptyDomView(config);

    if (parse) this.parse();
};

/**
 * Recursively parse the configuration object and generate nodes,
 * ref based and loop based maps.
 * @param [config] {Object} Used if present instead of the instance config
 * @param [parentNode] {HTMLElement} Parent to add element node into
 */
jMVP.View.prototype.parse = function(config, parentNode) {

    jMVP.each(config || this.config, function(nodeId, itemConfig) {

        var eNode = this.createNode(nodeId, itemConfig.tag);
        this.storeNode(nodeId, eNode);

        (parentNode || this.domView).appendChild(eNode);

        itemConfig.children && this.parse(itemConfig.children, eNode);

        itemConfig.hook && this.hook(itemConfig.hook, eNode);

        itemConfig.loop && this.storeLoop(itemConfig.loop, eNode);

    }, this);
};

/**
 * Update the view with the new value for a given reference
 * @param ref {String} Reference used with the hook
 * @param value {*} The new value
 */
jMVP.View.prototype.update = function(ref, value) {

    if (this.refMap[ref]) {

        if (typeof value == 'string' || value.constructor == Boolean) {
            this.applyHooks(ref, value);
        }

        if (value.constructor == Array) {
            this.applyHooks(ref, value.join(', '));
        }
    }

    if (this.loopMap[ref]) {
        this.loop(ref, value);
    }
};

/**
 * Execute a loop config, called on update affecting loops
 * @param ref {String} Data source reference
 * @param value {*}
 */
jMVP.View.prototype.loop = function(ref, value) {

    var valueLen = value.length;

    jMVP.each(this.loopMap[ref], function(loopConfig) {

        jMVP.each(loopConfig.template, function(key, itemConfig) {

            this.loopNodes(valueLen, loopConfig, itemConfig, key);

        }, this);

        this.applyHooks(ref, value);

    }, this);
};

/**
 * Update stored loop nodes to match the length of the value being passed.
 * @param valueLen
 * @param loopConfig
 * @param itemConfig
 * @param key
 */
jMVP.View.prototype.loopNodes = function(valueLen, loopConfig, itemConfig, key) {

    var nodes = this.nodeMap[key],
        nodesLen = nodes ? nodes.length : 0,
        count = 0;

    if (nodesLen === 0) count = valueLen;
    else if (nodesLen !== valueLen) {

        if (nodesLen < valueLen) count = valueLen - nodesLen;
        else {

            count = nodesLen - valueLen;

            var i = 0;
            var parentNode = loopConfig.parent;

            for (; i < count; i++) {
                parentNode.removeChild(nodes[nodesLen - (i + 1)]);
            }

            // reset count to avoid creation of new nodes
            count = 0;
        }
    }

    nodes = this.doNodes(count, itemConfig.tag, key);

    jMVP.each(nodes, function(node) {

        loopConfig.parent.appendChild(node);
        this.hook(itemConfig.hook, node);

    }, this);
};

/**
 * Generate and store nodes
 * @param count
 * @param tag
 * @param ref
 */
jMVP.View.prototype.doNodes = function(count, tag, ref) {

    var i = 0,
        nodes = [];

    for (; i < count; i++) {

        var node = this.createNode(ref, tag);
        this.storeNode(ref, node);
        nodes.push(node);
    }

    return nodes;
};

/**
 * Store a configuration loop object inside the loop map object
 * @param loopConfig {Object} Loop configuration object
 * @param parentNode {HTMLElement} The container for the loop
 */
jMVP.View.prototype.storeLoop = function(loopConfig, parentNode) {

    // TODO handle case where source isn't defined.
    var source = loopConfig.source;

    loopConfig.parent = parentNode;

    if (!this.loopMap[source]) this.loopMap[source] = [];
    this.loopMap[source].push(loopConfig);
};

/**
 * Handle the hook object for a given node
 * @param config {Object} Hook configuration object
 * @param node {HTMLElement} Node currently targeted
 */
jMVP.View.prototype.hook = function(config, node) {
    jMVP.each(config, function(hook, value) {
        jMVP.View.hooks[hook] && this.storeHook(node, hook, value);
    }, this);
};

/**
 * Store hook configuration
 * @param node {HTMLElement} The node targeted
 * @param hook {String} The hook name
 * @param value {String|Object} Only an object for attr and css hooks
 */
jMVP.View.prototype.storeHook = function(node, hook, value) {

    if (typeof value == 'string') {

        if (!this.refMap[value]) this.refMap[value] = {};
        if (!this.refMap[value][hook]) this.refMap[value][hook] = [];
        this.refMap[value][hook].push(node);

    } else {

        jMVP.each(value, function(valueKey, valueValue) {
            if (!this.refMap[valueValue]) this.refMap[valueValue] = {};
            if (!this.refMap[valueValue][hook]) this.refMap[valueValue][hook] = {};
            if (!this.refMap[valueValue][hook][valueKey]) this.refMap[valueValue][hook][valueKey] = [];
            this.refMap[valueValue][hook][valueKey].push(node);
        }, this);
    }
};

/**
 * Apply hooks to nodes stored under the given reference
 * @param ref {String} Value reference mapped to nodes
 * @param value {*} The value used by the hooks
 */
jMVP.View.prototype.applyHooks = function(ref, value) {

    var data = value.constructor == Array ? value : [value];

    jMVP.each(this.refMap[ref] || [], function(hookMethod, hook) {

        // text, html, display
        if (hook[0]) {

            jMVP.each(data, function(value, i) {
                jMVP.View.hooks[hookMethod](hook[i], value);
            });

            // css, attr
        } else {
            jMVP.each(hook, function(key, nodes) {
                jMVP.each(data, function(value, i) {
                    jMVP.View.hooks[hookMethod](nodes[i], key, value);
                });
            });
        }

    });
};

/**
 * Create a new dom element and store it in the node map
 * @param id {String} Id reference in the view used as className
 * @param [tag] {String} Tag name to use to create the new element
 */
jMVP.View.prototype.createNode = function(id, tag) {

    var node = jMVP.dom.createNode(tag);
    node.className = id;
    return node;
};

/**
 * Store a node to the node map property
 * @param id {String} Node reference
 * @param node {HTMLElement} The node
 */
jMVP.View.prototype.storeNode = function(id, node) {

    if (!this.nodeMap[id]) this.nodeMap[id] = node;
    else {
        if (this.nodeMap[id].constructor != Array) {
            var currentNode = this.nodeMap[id];
            this.nodeMap[id] = [];
            this.nodeMap[id].push(currentNode);
        }
        this.nodeMap[id].push(node);
    }
};

/**
 * Render the DOM view to a target DOM element
 * @param target {Node} The DOM element targeted
 */
jMVP.View.prototype.render = function(target) {

    target.appendChild(this.domView);
    this.domView = target.childNodes[target.childNodes.length-1];
};

/**
 * Check if a node key id is in the map
 * @param id
 * @returns {boolean}
 */
jMVP.View.prototype.isInMap = function(id) {
    var isIn = this.map[id] || this.loopMap[id] || null;
    return isIn ? true : false;
};

/*************** Getters ***************/

jMVP.View.prototype.getConfig = function() {
    return this.config;
};

jMVP.View.prototype.getNodeMap = function() {
    return this.nodeMap;
};

jMVP.View.prototype.getNode = function(id) {
    return this.nodeMap[id] || null;
};

jMVP.View.prototype.getLoopMap = function() {
    return this.loopMap;
};

jMVP.View.prototype.getRefMap = function() {
    return this.refMap;
};

jMVP.View.prototype.getDomView = function() {
    return this.domView;
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
     * @param nodes {Array} Array of nodes
     * @param value {String} Value to be set as text
     */
    text: function(nodes, value) {
        jMVP.dom(nodes).text(value);
    },

    /**
     * HTML update hook
     * @param nodes {Array} Array of nodes
     * @param value
     */
    html: function(nodes, value) {
        jMVP.dom(nodes).html(value);
    },

    /**
     * Attributes update hook
     * @param nodes {Array} Array of nodes
     * @param value
     * @param key
     */
    attr: function(nodes, key, value) {
        jMVP.dom(nodes)[(value === false || value === null ? 'rm' : 'set') + 'Attr'](key, value);
    },

    /**
     * CSS classes update hook
     * @param nodes {Array} Array of nodes
     * @param yes {Boolean} Decide if we remove or add the class name
     * @param cssName {String} CSS class name
     */
    css: function(nodes, cssName, yes) {
        jMVP.dom(nodes)[(yes ? 'add' : 'remove') + 'Class'](cssName);
    },

    /**
     * Show/Hide an element using the display property
     * @param nodes {Array} Array of nodes
     * @param [yes] {Boolean}
     */
    display: function(nodes, yes) {
        jMVP.dom(nodes).display(yes);
    }
};


/**
 * Static method creating a new empty dom view based on a view config.
 * Support custom id/tag/className, those options are delete from the config object after use.
 * @param config {Object} View configuration object
 */
jMVP.View.emptyDomView = function(config) {

    var domView;

    if (config.tag) {
        domView = jMVP.dom.createNode(config.tag);
        delete config.tag;
    } else {
        domView = jMVP.dom.createNode();
    }

    if (config.id) {
        domView.id = config.id;
        delete config.id;
    }

    if (config.className) {
        domView.className = config.className;
        delete config.className;
    }

    return domView;
};
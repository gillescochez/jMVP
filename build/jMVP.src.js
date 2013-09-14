(function() {

/**
 * Create a new jMVP instance
 *
 * @prop rawModel {Object} The original model config object
 * @prop rawView {Object} The original model config object
 * @prop rawPresenter {Object} The original model config object
 * @prop model {Object} Instance of jMVP.Model
 * @prop view {Object} Instance of jMVP.View
 * @prop presenter {Object} Instance of jMVP.Presenter
 *
 * @param rawModel {Object} The original model object
 * @param rawView {Object} The view configuration object
 * @param rawPresenter {Object} The presenter configuration object
 *
 * @example
 *
 * var oModel = {
 *      hello: 'Hello World'
 * };
 *
 * var oView = {
 *      foo: {
 *          text: 'hello'
 *      }
 * };
 *
 * var oPresenter = {
 *      foo: {
 *          click: function(oDOMEvent, oModel, oView) {
 *
 *          }
 *      }
 * };
 *
 * var oJmvp = new jMVP(oModel, oView, oPresenter);
 *
 * @constructor
 */
var jMVP = function(rawModel, rawView, rawPresenter) {

    this.rawModel = rawModel;
    this.rawView = rawView;
    this.rawPresenter = rawPresenter;

    this.model = new jMVP.Model(rawModel);
    this.view = new jMVP.View(rawView, true);
    this.presenter = new jMVP.Presenter(rawPresenter, this.view, this.model);

    this.addModelListener();
    this.applyModelToView();
};

/**
 * Set the onModelUpdated listener
 */
jMVP.prototype.addModelListener = function() {
    this.model.onModelUpdated = function(key, value) {
        this.view.update(key, value);
    }.bind(this);
};

/**
 * Loop through all original data and update the view accordingly
 */
jMVP.prototype.applyModelToView = function() {
    jMVP.each(this.rawModel, function(key, value) {
        this.view.update(key, value);
    }, this);
};

/**
 * Getter for the original model configuration object
 * @returns {Object}
 */
jMVP.prototype.getModel = function(){
    return this.model;
};

/**
 * Getter for the original view configuration object
 * @returns {Object}
 */
jMVP.prototype.getView = function(){
    return this.view;
};

/**
 * Getter for the original presenter configuration object
 * @returns {Object}
 */
jMVP.prototype.getPresenter = function(){
    return this.presenter;
};

/**
 * Getter for the original model configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawModel = function(){
    return this.rawModel;
};

/**
 * Getter for the original view configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawView = function(){
    return this.rawView;
};

/**
 * Getter for the original presenter configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawPresenter = function(){
    return this.rawPresenter;
};
/**
 * Helper function which return a new instance of jMVP.dom.Wrap which allow chained method calls.
 *
 * @example
 *
 * var eNode = document.createElement('div');
 *
 * jMVP.dom(eNode).addClass('foo').on('click', function(oEvent) {
 *      // do something
 * });
 *
 * document.body.appendChild(eNode);
 *
 * @param nodes {NodeList|Array} NodeList or array of nodes
 * @returns {jMVP.dom.Wrap} Class instance containing the nodes
 * @namespace
 */
jMVP.dom = function(nodes) {
	return new jMVP.dom.Wrap(nodes);
};

/**
 * Create a new DOM element and return it
 * @param [tag] {String} Tag name of the element
 * @returns {HTMLElement}
 */
jMVP.dom.createNode = function(tag) {
    return document.createElement(tag || 'div');
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation. It returns itself so that methods can be chained.
 * @param nodes {NodeList|Array} NodeList or array of nodes
 * @prop nodes {Array} Stored the nodes as an array
 * @returns {{}} Returns itself to allow chaining
 * @constructor
 */
jMVP.dom.Wrap = function(nodes) {
	if (!nodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.nodes = nodes[1] ? Array.prototype.slice.call(nodes) : (nodes[0] ? nodes : [nodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param callback {Function} Function to be called on each iteration
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.each = function(callback) {
	jMVP.each(this.nodes, function(node) {
		callback.apply(node);
	});
	return this;
};

/**
 * Bind a handler to elements
 * @param eventType {String} The event type
 * @param callback {Function} Function to be called when the event is triggered
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.on = function(eventType, callback) {
    return this.each(function() {
        jMVP.dom.on(this, eventType, callback);
    });
};

/**
 * Unbind a handler to the first element
 * @param eventType {String} The type of the DOM event
 * @param callback {Function} Handling function for the event type
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.off = function(eventType, callback) {
    return this.each(function() {
        jMVP.dom.off(this, eventType, callback);
    });
};

/**
 * Add a CSS class name to element(s)
 * @param name {String} The class name to be added
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.addClass = function(name) {
	return this.each(function() {
		this.className += ' ' + name;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param name {String} The class name to be removed
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.removeClass = function(name) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + name, 'gi'), '') : '';
	});
};

/**
 * Update the TEXT value of nodes
 * @param value {String} The TEXT string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.text = function(value) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = value;
	});
};

/**
 * Update the innerHTML of nodes
 * @param value {String}  The HTML string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.html = function(value) {
	return this.each(function() {
		this.innerHTML = value;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param key {String} Attribute key
 * @param value {String} Attribute value
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.setAttr = function(key, value) {
	return this.each(function() {
		this.setAttribute(key, value);
	});
};

/**
 * Remove a given attribute from nodes
 * @param key {String} Attribute key
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.rmAttr = function(key) {
	return this.each(function() {
		this.removeAttribute(key);
	});
};

/**
 * Show/Hide nodes using the display attribute. Default to show. Pass false argument to hide.
 * @param [yes] {Boolean} Pass as false to hide
 * @returns {Object}
 */
jMVP.dom.Wrap.prototype.display = function(yes) {
    var value = yes !== false ? '' : 'none';
    return this.each(function() {
        this.style.display = value;
    });
};

/**
 * HTML Element used to do feature detection
 * @type {Node}
 */
jMVP.dom.DIV = document.createElement('div');

/**
 * Return the supported insert text method by the browser as a string
 * @type {string}
 */
jMVP.dom.INNER_TEXT = ('innerText' in jMVP.dom.DIV) ? 'innerText' : 'textContent';

/**
 * Return a on (event bind) function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.on =  jMVP.dom.DIV.addEventListener
    ? function(node, eventType, callback) {
        node.addEventListener(eventType, callback, false);
    }
    : function(node, eventType, callback) {
        node.attachEvent('on' + eventType, callback);
    };

/**
 * Event unbinding function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.off =  jMVP.dom.DIV.removeEventListener
    ? function(node, eventType, callback) {
        node.removeEventListener(eventType, callback);
    }
    : function(node, eventType, callback) {
        node.detachEvent('on' + eventType, callback);
    };
/**
 * jMVP Model object constructor
 * @param model {{}} Model data object
 *
 * @example
 *
 * var model = new jJVM.Model({
 *      foo: 'foo',
 *      isEnabled: false,
 *      list: ['a', 'b'],
 *      obj: {a:true, b:false}
 * });
 *
 * @constructor
 */
jMVP.Model = function(model) {

	jMVP.each(model, function(key) {
		jMVP.Model.dataBind(this, model, key);
	}, this);
};

/**
 * Get called when a data object get updated
 * @param sKey {String} Model key which has its value updated
 * @param vValue {*} The updated value
 */
jMVP.Model.prototype.onModelUpdated = function(key, value) {};

/**
 * Create the setter/getter API and keep the raw data sync
 * @param instance {Object} jMVP.Model object instance
 * @param model {Object} Raw model object
 * @param key {String} The string being bind
 */
jMVP.Model.dataBind = function(instance, model, key) {

    instance[key] = function(value) {
        if (value !== undefined) instance[key].oData.setValue(value);
        return instance[key].oData.getValue();
    };

	instance[key].oData = new jMVP.Data(model[key]);

    instance[key].oData.onValueUpdated = function(value) {
		model[key] = value;
        instance.onModelUpdated.apply(instance, [key, value]);
	};
};

/**
 * jMVP Data object constructor
 * @param value {*} Original value to store
 *
 * @example
 *
 * var oData = new jMVP.Data('foo');
 *
 * oData.onValueUpdated = function(sValue) {
 *      // do something
 * };
 *
 * oData.setValue('FOO');
 *
 * @constructor
 */
jMVP.Data = function(value) {
	this.value = value;
};

/**
 * Set the new value for the Data object
 * @param value {*} The new data for the current instance
 */
jMVP.Data.prototype.setValue = function(value) {
	this.value = value;
	this.onValueUpdated(this.value);
};

/**
 * Return the current value stored in the data object
 * @returns {*} The currently stored value
 */
jMVP.Data.prototype.getValue = function() {
	return this.value;
};

/**
 * Callback function of the setter, the updated value is passed as argument
 * @param vValue {*} The model updated value
 */
jMVP.Data.prototype.onValueUpdated = function(value){};
/**
 * jMVP Presenter object constructor
 *
 * @prop oMap {{}} View reference based map of handler objects
 * @prop view {{}} Store the jMVP.View instance if any passed
 * @prop model {{}} Store the jMVP.Model instance if any passed
 *
 * @param config {{}} Presenter configuration object
 * @param [view] {{}} jMVP.View instance object
 * @param [model] {{}} jMVP.Model instance object
 *
 * @example
 *
 * var oPresenterConfig = {
 *      foo: {
 *          click: function() {}
 *      }
 * };
 *
 * var oPresenter = new jMVP.Presenter(oPresenterConfig, view, model);
 *
 * @constructor
 */
// TODO Improve event binding, we want to use delegation
jMVP.Presenter = function(config, view, model) {

	this.map = {};
    this.view = view || null;
    this.model = model || null;
    this.config = config;

	jMVP.each(config, function(ref, handlers) {
        this.map[ref] = handlers;
        this.view && this.bindToView(ref);
	}, this);
};

/**
 * Bind element in a view with the handler matching its reference
 * @param ref {String} View element reference name
 */
jMVP.Presenter.prototype.bindToView = function(ref) {

    var view = this.view,
        model = this.model;

    jMVP.each(this.map[ref], function(eventType, handler) {

        var node = view.getNode(ref);

        jMVP.dom(node).on(eventType, function(event) {
            handler.apply(node, [event, model, view]);
        });
    });
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param domEvent {Object} The event object given by the DOM
 */
jMVP.Presenter.prototype.routeEvent = function(domEvent) {

	var node = domEvent.target,
		ref;

	jMVP.each(node.className.indexOf(' ') !== -1 ? node.className.split(' ') : [node.className], function(name) {

		if (name.substring(0, 4) === 'jMVP') {

			ref = name.substring(5, name.length);

			if (this.map.hasOwnProperty(ref)) {

				if (this.map[ref][domEvent.type]) {
					// TODO What to use as context?
                    this.map[ref][domEvent.type].apply(node, [domEvent, this.view, this.model])
				}
			}
		}
	}, this);
};

/**
 * Config object getter
 * @returns {Object}
 */
jMVP.Presenter.prototype.getConfig = function() {
    return this.config;
};

/**
 * Map object getter
 * @returns {Object}
 */
jMVP.Presenter.prototype.getMap = function() {
    return this.map;
};

/**
 * Check if a key is in the map
 * @param key
 * @returns {boolean}
 */
jMVP.Presenter.prototype.isInMap = function(key) {
    return this.map[key] ? true : false;
};

/**
 * Model instance object getter
 * @returns {jMVP.Model}
 */
jMVP.Presenter.prototype.getModel = function() {
    return this.model;
};

/**
 * View instance object getter
 * @returns {jMVP.View}
 */
jMVP.Presenter.prototype.getView = function() {
    return this.view;
};
/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param data {*} The data to iterate over
 * @param callback {Function} The callback function
 * @param [context] {{}} The object context used to run the callback in
 *
 * @example
 *
 * // Basic usage
 * jMVP.each(['a', 'b'], function(sValue, nIdx) {
 *      console.log(sValue);
 * });
 *
 * @example
 *
 * // Using the context parameter
 * function foo() {
 *
 *      this.log = function(sValue) {
 *          console.log(sValue);
 *      }
 *
 *      jMVP.each(['a', 'b'], function(sValue) {
 *          this.log(sValue);
 *      }, this);
 * }
 *
 */
jMVP.each = function(data, callback, context) {

    var key;

    if (data.constructor === Object && data.constructor !== Array) {

        for (key in data) {

            if (data.hasOwnProperty(key) && data[key]) {
                callback.apply(context, [key, data[key]]);
            }
        }

    } else if (typeof data === "string" || data instanceof Array) {

        (typeof data === "string" ? data.split("") : data).forEach(function(value, i) {
            callback.apply(context, [value, i]);
        });
    }
};

/**
 * Send a error message out
 * @param msg {String} Error message
 * @param type {Number} Error type
 */
jMVP.error = function(msg, type) {
    throw new Error(msg + ' - Error: ' + type);
};
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

window.jMVP = jMVP;

})();
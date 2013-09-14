(function() {

/**
 * Create a new jMVP instance
 *
 * @prop oRawModel {Object} The original model config object
 * @prop oRawView {Object} The original model config object
 * @prop oRawPresenter {Object} The original model config object
 * @prop model {Object} Instance of jMVP.Model
 * @prop view {Object} Instance of jMVP.View
 * @prop presenter {Object} Instance of jMVP.Presenter
 *
 * @param oRawModel {Object} The original model object
 * @param oRawView {Object} The view configuration object
 * @param oRawPresenter {Object} The presenter configuration object
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
var jMVP = function(oRawModel, oRawView, oRawPresenter) {

    this.oRawModel = oRawModel;
    this.oRawView = oRawView;
    this.oRawPresenter = oRawPresenter;

    this.model = new jMVP.Model(oRawModel);
    this.view = new jMVP.View(oRawView, true);
    this.presenter = new jMVP.Presenter(oRawPresenter, this.view, this.model);

    this.addModelListener();
    this.applyModelToView();
};

/**
 * Set the onModelUpdated listener
 */
jMVP.prototype.addModelListener = function() {
    this.model.onModelUpdated = function(sKey, vValue) {
        this.view.update(sKey, vValue);
    }.bind(this);
};

/**
 * Loop through all original data and update the view accordingly
 */
jMVP.prototype.applyModelToView = function() {
    jMVP.each(this.oRawModel, function(sKey, vValue) {
        this.view.update(sKey, vValue);
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
    return this.oRawModel;
};

/**
 * Getter for the original view configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawView = function(){
    return this.oRawView;
};

/**
 * Getter for the original presenter configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawPresenter = function(){
    return this.oRawPresenter;
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
 * @param vNodes {NodeList|Array} NodeList or array of nodes
 * @returns {jMVP.dom.Wrap} Class instance containing the nodes
 * @namespace
 */
jMVP.dom = function(vNodes) {
	return new jMVP.dom.Wrap(vNodes);
};

/**
 * Create a new DOM element and return it
 * @param [sTag] {String} Tag name of the element
 * @returns {HTMLElement}
 */
jMVP.dom.createNode = function(sTag) {
    return document.createElement(sTag || 'div');
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation. It returns itself so that methods can be chained.
 * @param vNodes {NodeList|Array} NodeList or array of nodes
 * @prop aNodes {Array} Stored the nodes as an array
 * @returns {{}} Returns itself to allow chaining
 * @constructor
 */
jMVP.dom.Wrap = function(vNodes) {
	if (!vNodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.aNodes = vNodes[1] ? Array.prototype.slice.call(vNodes) : (vNodes[0] ? vNodes : [vNodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param fCallback {Function} Function to be called on each iteration
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.each = function(fCallback) {
	jMVP.each(this.aNodes, function(eNode) {
		fCallback.apply(eNode);
	});
	return this;
};

/**
 * Bind a handler to elements
 * @param sEventType {String} The event type
 * @param fCallback {Function} Function to be called when the event is triggered
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.on = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.on(this, sEventType, fCallback);
    });
};

/**
 * Unbind a handler to the first element
 * @param sEventType {String} The type of the DOM event
 * @param fCallback {Function} Handling function for the event type
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.off = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.off(this, sEventType, fCallback);
    });
};

/**
 * Add a CSS class name to element(s)
 * @param sClassName {String} The class name to be added
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.addClass = function(sClassName) {
	return this.each(function() {
		this.className += ' ' + sClassName;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param sClassName {String} The class name to be removed
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.removeClass = function(sClassName) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + sClassName, 'gi'), '') : '';
	});
};

/**
 * Update the TEXT value of nodes
 * @param sValue {String} The TEXT string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.text = function(sValue) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = sValue;
	});
};

/**
 * Update the innerHTML of nodes
 * @param sValue {String}  The HTML string used to update elements
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.html = function(sValue) {
	return this.each(function() {
		this.innerHTML = sValue;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param sAttrKey {String} Attribute key
 * @param sAttrValue {String} Attribute value
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.setAttr = function(sAttrKey, sAttrValue) {
	return this.each(function() {
		this.setAttribute(sAttrKey, sAttrValue);
	});
};

/**
 * Remove a given attribute from nodes
 * @param sAttrKey {String} Attribute key
 * @returns {Object} Return itself for chaining
 */
jMVP.dom.Wrap.prototype.rmAttr = function(sAttrKey) {
	return this.each(function() {
		this.removeAttribute(sAttrKey);
	});
};

/**
 * Show/Hide nodes using the display attribute. Default to show. Pass false argument to hide.
 * @param [bDisplay] {Boolean} Pass as false to hide
 * @returns {Object}
 */
jMVP.dom.Wrap.prototype.display = function(bDisplay) {
    var sValue = bDisplay !== false ? '' : 'none';
    return this.each(function() {
        this.style.display = sValue;
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
    ? function(eNode, sEventType, fCallback) {
        eNode.addEventListener(sEventType, fCallback, false);
    }
    : function(eNode, sEventType, fCallback) {
        eNode.attachEvent('on' + sEventType, fCallback);
    };

/**
 * Event unbinding function compatible with the browser used
 * @type {Function}
 */
jMVP.dom.off =  jMVP.dom.DIV.removeEventListener
    ? function(eNode, sEventType, fCallback) {
        eNode.removeEventListener(sEventType, fCallback);
    }
    : function(eNode, sEventType, fCallback) {
        eNode.detachEvent('on' + sEventType, fCallback);
    };
/**
 * jMVP Model object constructor
 * @param oModel {{}} Model data object
 *
 * @example
 *
 * var oModel = new jJVM.Model({
 *      foo: 'foo',
 *      isEnabled: false,
 *      list: ['a', 'b'],
 *      obj: {a:true, b:false}
 * });
 *
 * @constructor
 */
jMVP.Model = function(oModel) {

	jMVP.each(oModel, function(sKey) {
		jMVP.Model.dataBind(this, oModel, sKey);
	}, this);
};

/**
 * Get called when a data object get updated
 * @param sKey {String} Model key which has its value updated
 * @param vValue {*} The updated value
 */
jMVP.Model.prototype.onModelUpdated = function(sKey, vValue) {};

/**
 * Create the setter/getter API and keep the raw data sync
 * @param oInstance {Object} jMVP.Model object instance
 * @param oModel {Object} Raw model object
 * @param sKey {String} The string being bind
 */
jMVP.Model.dataBind = function(oInstance, oModel, sKey) {

    oInstance[sKey] = function(vValue) {
        if (vValue !== undefined) oInstance[sKey].oData.setValue(vValue);
        return oInstance[sKey].oData.getValue();
    };

	oInstance[sKey].oData = new jMVP.Data(oModel[sKey]);

    oInstance[sKey].oData.onValueUpdated = function(vValue) {
		oModel[sKey] = vValue;
        oInstance.onModelUpdated.apply(oInstance, [sKey, vValue]);
	};
};

/**
 * jMVP Data object constructor
 * @param vValue {*} Original value to store
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
jMVP.Data = function(vValue) {
	this.vValue = vValue;
};

/**
 * Set the new value for the Data object
 * @param vValue {*} The new data for the current instance
 */
jMVP.Data.prototype.setValue = function(vValue) {
	this.vValue = vValue;
	this.onValueUpdated(this.vValue);
};

/**
 * Return the current value stored in the data object
 * @returns {*} The currently stored value
 */
jMVP.Data.prototype.getValue = function() {
	return this.vValue;
};

/**
 * Callback function of the setter, the updated value is passed as argument
 * @param vValue {*} The model updated value
 */
jMVP.Data.prototype.onValueUpdated = function(vValue){};
/**
 * jMVP Presenter object constructor
 *
 * @prop oMap {{}} View reference based map of handler objects
 * @prop view {{}} Store the jMVP.View instance if any passed
 * @prop model {{}} Store the jMVP.Model instance if any passed
 *
 * @param oConfig {{}} Presenter configuration object
 * @param [oView] {{}} jMVP.View instance object
 * @param [oModel] {{}} jMVP.Model instance object
 *
 * @example
 *
 * var oPresenterConfig = {
 *      foo: {
 *          click: function() {}
 *      }
 * };
 *
 * var oPresenter = new jMVP.Presenter(oPresenterConfig, oView, oModel);
 *
 * @constructor
 */
// TODO Improve event binding, we want to use delegation
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.view = oView || null;
    this.model = oModel || null;
    this.oConfig = oConfig;

	jMVP.each(oConfig, function(sReference, oHandlers) {

        // TODO check if present in view before store as handler to allow methods to be attached to the presenter in a "clean" manner
		this.oMap[sReference] = oHandlers;
        this.view && this.bindToView(sReference);
	}, this);
};

/**
 * Bind element in a view with the handler matching its reference
 * @param sReference {String} View element reference name
 */
jMVP.Presenter.prototype.bindToView = function(sReference) {

    var oView = this.view,
        oModel = this.model;

    jMVP.each(this.oMap[sReference], function(sEventType, fHandler) {

        var eNode = oView.getNode(sReference);
        jMVP.dom(eNode).on(sEventType, function(oEvent) {
            fHandler.apply(eNode, [oEvent, oModel, oView]);
        });
    });
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param oDOMEvent {Object} The event object given by the DOM
 */
jMVP.Presenter.prototype.routeEvent = function(oDOMEvent) {

	var eNode = oDOMEvent.target,
		sReference;

	jMVP.each(eNode.className.indexOf(' ') !== -1 ? eNode.className.split(' ') : [eNode.className], function(sClassName) {

		if (sClassName.substring(0, 4) === 'jMVP') {

			sReference = sClassName.substring(5, sClassName.length);

			if (this.oMap.hasOwnProperty(sReference)) {

				if (this.oMap[sReference][oDOMEvent.type]) {
					// TODO What to use as context?
                    this.oMap[sReference][oDOMEvent.type].apply(eNode, [oDOMEvent, this.view, this.model])
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
    return this.oConfig;
};

/**
 * Map object getter
 * @returns {Object}
 */
jMVP.Presenter.prototype.getMap = function() {
    return this.oMap;
};

/**
 * Check if a key is in the map
 * @param sKey
 * @returns {boolean}
 */
jMVP.Presenter.prototype.isInMap = function(sKey) {
    return this.oMap[sKey] ? true : false;
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
 * @param vData {*} The data to iterate over
 * @param fCallback {Function} The callback function
 * @param [oContext] {{}} The object context used to run the callback in
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
jMVP.each = function(vData, fCallback, oContext) {

    var sKey;

    if (vData.constructor === Object && vData.constructor !== Array) {

        for (sKey in vData) {

            if (vData[sKey]) {
                fCallback.apply(oContext, [sKey, vData[sKey]]);
            }
        }

    } else if (typeof vData === "string" || vData instanceof Array) {

        (typeof vData === "string" ? vData.split("") : vData).forEach(function(vValue, nIdx) {
            fCallback.apply(oContext, [vValue, nIdx]);
        });
    }
};

/**
 * Send a error message out
 * @param sMessage {String} Error message
 * @param nType {Number} Error type
 */
jMVP.error = function(sMessage, nType) {
    throw new Error(sMessage + ' - Error: ' + nType);
};
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

            this.loopNodes(nValueLen, oLoopConfig, oTemplateItemConfig, sItemKey);

        }, this);

        this.applyHooks(sReference, vValue);

    }, this);
};

/**
 * Update stored loop nodes to match the length of the value being passed.
 * @param nValueLen
 * @param oLoopConfig
 * @param oTemplateItemConfig
 * @param sItemKey
 */
jMVP.View.prototype.loopNodes = function(nValueLen, oLoopConfig, oTemplateItemConfig, sItemKey) {

    var aNodes = this.oNodeMap[sItemKey],
        nNodesLen = aNodes ? aNodes.length : 0,
        nNodesCount = 0;

    if (nNodesLen === 0) nNodesCount = nValueLen;
    else if (nNodesLen !== nValueLen) {

        if (nNodesLen < nValueLen) nNodesCount = nValueLen - nNodesLen;
        else {

            nNodesCount = nNodesLen - nValueLen;

            var i = 0;
            var eParentNode = oLoopConfig.parent;

            for (; i < nNodesCount; i++) {
                eParentNode.removeChild(aNodes[nNodesLen - (i + 1)]);
            }

            // reset nNodesCount to avoid creation of new nodes
            nNodesCount = 0;
        }
    }

    aNodes = this.doNodes(nNodesCount, oTemplateItemConfig.tag, sItemKey);

    jMVP.each(aNodes, function(eNode) {

        oLoopConfig.parent.appendChild(eNode);
        this.hook(oTemplateItemConfig.hook, eNode);

    }, this);
};

/**
 * Generate and store nodes
 * @param nCount
 * @param sTag
 * @param sReference
 */
jMVP.View.prototype.doNodes = function(nCount, sTag, sReference) {

    var i = 0,
        aNodes = [];

    for (; i < nCount; i++) {

        var eNode = this.createNode(sReference, sTag);
        this.storeNode(sReference, eNode);
        aNodes.push(eNode);
    }

    return aNodes;
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

    // TODO convert vValue into an array if it isn't to cleanup code below
    var pData = vValue.constructor == Array ? vValue : [vValue];

    jMVP.each(this.oRefMap[sReference] || [], function(sHook, vHook) {

        // text, html, display
        if (vHook[0]) {

            jMVP.each(pData, function(sValue, nIndex) {
                jMVP.View.hooks[sHook](vHook[nIndex], sValue);
            });

            // css, attr
        } else {
            jMVP.each(vHook, function(sKey, aNodes) {
                jMVP.each(pData, function(sValue, nIndex) {
                    jMVP.View.hooks[sHook](aNodes[nIndex], sKey, sValue);
                });
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

window.jMVP = jMVP;

})();
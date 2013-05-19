(function() {

/**
 * Create a new jMVP instance
 *
 * @prop oRawModel {Object} The original model confi object
 * @prop oRawView {Object} The original model confi object
 * @prop oRawPresenter {Object} The original model confi object
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
    this.view = new jMVP.View(oRawView);
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
        this.view.isInMap(sKey) && this.view.update(sKey, vValue);
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
	oInstance[sKey] = new jMVP.Data(oModel[sKey]);
	oInstance[sKey].onValueUpdated = function(vValue) {
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
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.view = oView || null;
    this.model = oModel || null;
    this.oConfig = oConfig;

	jMVP.each(oConfig, function(sReference, oHandlers) {
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
        var eNode = this.view.getElement(sReference);
        jMVP.dom(eNode).on(sEventType, function(oEvent) {
            fHandler.apply(eNode, [oEvent, oModel, oView]);
        });
    }, this);
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

    // TODO write test for updateHooks and updateLoop
    if (this.oLoopMap[sReference]) this.updateLoop(sReference, vValue);
    else if (this.oMap[sReference]) this.updateHooks(sReference, vValue);
    else {}
};

/**
 * Update elements which are affected by the value change
 * @param sReference {String} Model key
 * @param vValue {*} Value to be used in hooks
 */
jMVP.View.prototype.updateHooks = function(sReference, vValue) {

    jMVP.each(this.oMap[sReference], function(sHookKey, vHookConfig) {

        if (jMVP.View.hooks[sHookKey]) {

            if (sHookKey == 'attributes' || sHookKey == 'classNames') {

                jMVP.each(vHookConfig, function(sKey, aNodes) {
                    jMVP.View.hooks[sHookKey](aNodes, vValue, sKey);
                });

            } else {

                jMVP.View.hooks[sHookKey](vHookConfig, vValue);
            }
        }

    }, this);
};

/**
 * Update elements which are affected by the value change
 * @param sReference {String} Model key
 * @param vValue {*} Value to be used in hooks
 */
// TODO cleanup this mess it works but quite a hack and no tests =/
jMVP.View.prototype.updateLoop = function(sReference, vValue) {

    jMVP.each(this.oLoopMap[sReference], function(oLoopConfig) {

        var eParent = oLoopConfig.parent,
            template = oLoopConfig.config.template;

        // we might need to refresh the dom
        //TODO map this smarter and only add/remove necessary elements
        if (!this.oMap[sReference] ||

            this.oMap[sReference].nNodesCount / this.oMap[sReference].nHooksCount !== vValue.length) {

            jMVP.dom(eParent).html('');

            jMVP.each(vValue, function(sValue) {

                var eNode = document.createElement('div');

                this.generate(template, eNode);

                eParent.appendChild(eNode.childNodes[0]);

            }, this);

        }

        // actually apply the hooks
        jMVP.each(this.oMap[sReference], function(sHookKey, vHookConfig) {

            jMVP.each(vValue, function(sValue, nIdx) {

                if (jMVP.View.hooks[sHookKey]) {

                    if (sHookKey == 'attributes' || sHookKey == 'classNames') {

                        jMVP.each(vHookConfig, function(sKey) {
                            jMVP.View.hooks[sHookKey](eParent.childNodes[nIdx], sValue, sKey);
                        });

                    } else {

                        jMVP.View.hooks[sHookKey](eParent.childNodes[nIdx], sValue);
                    }
                }
            }, this);

        }, this);

    }, this);
};

/**
 * Generate the map and the element necessary to generate the UI (DOM)
 * @param oConfig {Object}
 * @param [eParentNode] {HTMLElement}
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
        this.mapHooks(vValue, eNode);

        // handle loops
        vValue.loop && this.mapLoop(sKey, vValue.loop, eNode);

        // handle children
        vValue.children && this.generate(vValue.children, eNode);

        eView.appendChild(eNode);

    }, this);

    return eView;
};

/**
 * Map hooks properties to oMap
 * @param oConfig {Object} Hooks config
 * @param eNode {HTMLElement}
 */
jMVP.View.prototype.mapHooks = function(oConfig, eNode) {

    jMVP.each(jMVP.View.hooks, function(sHookKey) {

        if (oConfig[sHookKey]) {

            // Handle attributes and classNames objects
            if (sHookKey === 'attributes' || sHookKey === 'classNames') {

                jMVP.each(oConfig[sHookKey], function(sKey, sValue) {
                    if (!this.oMap[sValue]) {
                        this.oMap[sValue] = {
                            nNodesCount: 0,
                            nHooksCount: 0
                        };
                    }
                    if (!this.oMap[sValue][sHookKey]) {
                        this.oMap[sValue][sHookKey] = {};
                        this.oMap[sValue].nHooksCount++;
                    }
                    if (!this.oMap[sValue][sHookKey][sKey]) this.oMap[sValue][sHookKey][sKey] = [];
                    this.oMap[sValue][sHookKey][sKey].push(eNode);
                    this.oMap[sValue].nNodesCount++;
                }, this);

            } else {

                if (!this.oMap[oConfig[sHookKey]]) {
                    this.oMap[oConfig[sHookKey]] = {
                        nNodesCount: 0,
                        nHooksCount: 0
                    };
                }
                if (!this.oMap[oConfig[sHookKey]][sHookKey]) {
                    this.oMap[oConfig[sHookKey]][sHookKey] = [];
                    this.oMap[oConfig[sHookKey]].nHooksCount++;
                }
                this.oMap[oConfig[sHookKey]][sHookKey].push(eNode);
                this.oMap[oConfig[sHookKey]].nNodesCount++;
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

    if (!this.oLoopMap[oConfig.source]) {
        this.oLoopMap[oConfig.source] = [];
    }

    this.oLoopMap[oConfig.source].push({
        config: oConfig,
        parent: eNode
    });
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
    var vIsIn = this.oMap[sKey] || this.oLoopMap[sKey] || null;
    return vIsIn ? true : false;
};

/**
 * DOM element getter
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
 * @param nType {Interger} Error type
 */
jMVP.error = function(sMessage, nType) {
    if (window.console && console.error) {
        console.error(sMessage, nType);
    } else {
        throw sMessage + '' + nType;
    }
};
/**
 * Array.prototype.forEach
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(action, that) {
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this) {
                action.call(that, this[i], i, this);
            }
        }
    };
};

/**
 * Function.prototype.bind
 * from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
};

window.jMVP = jMVP;

})();
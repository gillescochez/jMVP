/**
 * Create a new jMVP instance
 * @param oRawModel
 * @param oRawView
 * @param oRawPresenter
 */
function jMVP(oRawModel, oRawView, oRawPresenter) {

    this.oRawModel = oRawModel;
    this.oRawView = oRawView;
    this.oRawPresenter = oRawPresenter;

    this.model = new jMVP.Model(oRawModel);
    this.view = new jMVP.View(oRawView);
    this.presenter = new jMVP.Presenter(oRawPresenter, this.view, this.model);

    (function(oThis) {
        oThis.model.onModelUpdated = function(sKey, vValue) {
            oThis.view.update(sKey, vValue);
        };
    })(this);
};

jMVP.CSS_PREFIX = 'jmvp-';

/**
 * Load resources and return a jMVP instance using those resources
 * @param sReference
 * @param fCallback
 */
jMVP.load = function(sReference, fCallback) {
    console.log(sReference, fCallback);
};

/**
 * Used to stored views declared using jMVP
 * @type {{}}
 */
jMVP.oViews = {};

/**
 * Declare a new jMVP static view object
 * @param sReference
 * @param oView
 */
jMVP.view = function(sReference, oView){
    jMVP.oViews[sReference] = oView;
};

/**
 * Used to store models declared using jMVP
 * @type {{}}
 */
jMVP.oModels = {};

/**
 * Declare a new jMVP static model object
 * @param sReference
 * @param oModel
 */
jMVP.model = function(sReference, oModel){
    jMVP.oModels[sReference] = oModel;
};

/**
 * Used to store presenters declared using jMVP
 * @type {{}}
 */
jMVP.oPresenters = {};

/**
 * Declare a new jMVP static presenter object
 * @param sReference
 * @param oPresenter
 */
jMVP.presenter = function(sReference, oPresenter){
    jMVP.oPresenters[sReference] = oPresenter;
};

/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param vData
 * @param fCallback
 * @param [oContext]
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

		// TODO write a Array.prototype.forEach shim
        (typeof vData === "string" ? vData.split("") : vData).forEach(function(vValue, nIdx) {
			fCallback.apply(oContext, [vValue, nIdx]);
		});
	}
};
/**
 * jMVP Model object constructor
 * @param oModel
 * @constructor
 */
jMVP.Model = function(oModel) {

	jMVP.each(oModel, function(sKey) {
		jMVP.Model.dataBind(this, oModel, sKey);
	}, this);
};

/**
 * Get called when a data object get updated
 * @param sKey
 * @param vValue
 */
jMVP.Model.prototype.onModelUpdated = function(sKey, vValue) {};

/**
 * Create the setter/getter API and keep the raw data sync
 * @param oInstance
 * @param oModel
 * @param sKey
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
 * @param vValue
 * @constructor
 */
jMVP.Data = function(vValue) {
	this.vValue = vValue;
};

/**
 * Set the new value for the Data object
 * @param vValue
 */
jMVP.Data.prototype.setValue = function(vValue) {
	this.vValue = vValue;
	this.onValueUpdated(this.vValue);
};

/**
 * Return the current value stored in the data object
 * @returns {*}
 */
jMVP.Data.prototype.getValue = function() {
	return this.vValue;
};

/**
 * Callback function of the setter, the updated value is passed as argument
 * @param vValue
 */
jMVP.Data.prototype.onValueUpdated = function(vValue){};
/**
 * jMVP Presenter object constructor
 * @param oConfig
 * @param [oView]
 * @param [oModel]
 * @constructor
 */
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.view = oView || null;
    this.model = oModel || null;

	jMVP.each(oConfig, function(sReference, oHandlers) {
		this.oMap[sReference] = oHandlers;
        this.view && this.bindToView(sReference);
	}, this);

};

/**
 * Bind element in a view with the handler matching its reference
 * @param sReference
 */
jMVP.Presenter.prototype.bindToView = function(sReference) {

    var oView = this.view,
        oModel = this.model;

    jMVP.each(this.oMap[sReference], function(sEventType, fHandler) {
        var eNode = jMVP.dom(this.view.eDomView).getByClass(jMVP.CSS_PREFIX + sReference);
        jMVP.dom(eNode).on(sEventType, function(oEvent) {
            fHandler.apply(eNode, [oEvent, oModel, oView]);
        });
    }, this);
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param oDOMEvent
 */
jMVP.Presenter.prototype.routeEvent = function(oDOMEvent) {

	var eNode = oDOMEvent.target,
		sReference;

	jMVP.each(eNode.className.indexOf(' ') !== -1 ? eNode.className.split(' ') : [eNode.className], function(sClassName) {

		if (sClassName.substring(0, 4) === 'jMVP') {

			sReference = sClassName.substring(5, sClassName.length);

			if (this.oMap.hasOwnProperty(sReference)) {

				if (this.oMap[sReference].hasOwnProperty(oDOMEvent.type)) {
					// TODO What to use as context?
                    this.oMap[sReference][oDOMEvent.type].apply(eNode, [oDOMEvent, this.view, this.model])
				}
			}
		}
	}, this);
};
/**
 * jMVP View object constructor
 * @param oView Object representation of the view and its binding
 * @constructor
 */
jMVP.View = function(oView) {

	this.oRawView = oView;
	this.oMap = {};

	this.eDomView = jMVP.View.objectToElement(
		this.oRawView, this.oMap
	);
};

/**
 * Render the DOM view to a target DOM element
 * @param eTarget
 */
jMVP.View.prototype.render = function(eTarget) {
	eTarget.appendChild(this.eDomView);
	this.eDomView = eTarget.childNodes[eTarget.childNodes.length-1];
};

/**
 * Update elements which are affected by the value change
 * @param sReference
 * @param vValue
 */
jMVP.View.prototype.update = function(sReference, vValue) {

	jMVP.each(this.oMap[sReference], function(sHookKey, vHookConfig) {

		if (sHookKey === 'attributes' || sHookKey === 'classNames') {

			jMVP.each(vHookConfig, function(sKey, aNodes) {
				jMVP.View.hooks[sHookKey](aNodes, vValue, sKey);
			});

		} else {

			jMVP.View.hooks[sHookKey](vHookConfig, vValue);
		}

	}, this);
};

/**
 * Hooks storage for special view binding
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
 * Convert an view object into DOM
 * @param oRawView
 * @param oMap
 * @param [eParentFragment]
 * @returns {DocumentFragment}
 */
//TODO refactoring, method is too long and doing too much stuff
jMVP.View.objectToElement = function(oRawView, oMap, eParentFragment) {

	// TODO try documentFragment approach - extra div is ugly :(
	var eView = eParentFragment || document.createElement('div');

	jMVP.each(oRawView, function(sKey, vValue) {

		var eNode = document.createElement(vValue.tag || 'div');

		// good idea?
		eNode.className = jMVP.CSS_PREFIX + sKey;

		// TODO is this needed? Think so if Hooks set on view object's root
//		if (jMVP.View.hooks[sKey]) {
//			jMVP.View.hooks[sKey](eTag, vValue);
//		}

		jMVP.each(jMVP.View.hooks, function(sHookKey) {

			if (vValue[sHookKey]) {

				// Handle attributes and classNames objects
				if (sHookKey === 'attributes' || sHookKey === 'classNames') {

					jMVP.each(vValue[sHookKey], function(sKey, sValue) {
						if (!oMap[sValue]) oMap[sValue] = {};
						if (!oMap[sValue][sHookKey]) oMap[sValue][sHookKey] = {};
						if (!oMap[sValue][sHookKey][sKey]) oMap[sValue][sHookKey][sKey] = [];
						oMap[sValue][sHookKey][sKey].push(eNode);
					});

				} else {
					if (!oMap[vValue[sHookKey]]) oMap[vValue[sHookKey]] = {};
					if (!oMap[vValue[sHookKey]][sHookKey]) oMap[vValue[sHookKey]][sHookKey] = [];
					oMap[vValue[sHookKey]][sHookKey].push(eNode);
				}
			}
		});

		if (jMVP.View.viewFragmentHasChildren(vValue)) {
			jMVP.View.objectToElement(vValue, oMap, eNode);
		}

		eView.appendChild(eNode);
	});

	return eView;
};

/**
 * Check a portion of a view object for children
 * @param oViewFragment
 * @returns {boolean}
 */
jMVP.View.viewFragmentHasChildren = function(oViewFragment) {

	var bReturn = false;

	jMVP.each(oViewFragment, function(sKey) {
		bReturn = !(jMVP.View.hooks[sKey] || sKey === 'tag');
	});

	return bReturn;
};
/**
 * Helper function which return a new instance of jMVP.dom.Wrap
 * @param eNodes
 * @returns {jMVP.dom.Wrap}
 */
jMVP.dom = function(eNodes) {
	return new jMVP.dom.Wrap(eNodes);
};

/**
 * Node/Node list wrapper class to simplify DOM manipulation
 * @param eNodes
 * @returns {*}
 * @constructor
 */
jMVP.dom.Wrap = function(eNodes) {
	if (!eNodes) throw "jMVP.dom.Wrap requires a node or node list object";
	this.aNodes = eNodes[1] ? Array.prototype.slice.call(eNodes) : (eNodes[0] ? eNodes : [eNodes]);
	return this;
};

/**
 * Iterate over the array of node store and run a callback function using the node as context
 * so "this" in the callback is the node
 * @param fCallback
 */
jMVP.dom.Wrap.prototype.each = function(fCallback) {
	jMVP.each(this.aNodes, function(eNode) {
		fCallback.apply(eNode);
	});
	return this;
};

/**
 * Return a single element by class name
 * @param sClassName
 * @returns {*}
 */
jMVP.dom.Wrap.prototype.getByClass = function(sClassName) {
    return jMVP.dom.getElementByClassName(sClassName, this.aNodes[0]);
};

/**
 * Bind a handler to the first element
 * @param sEventType
 * @param fCallback
 * @returns {Function}
 */
jMVP.dom.Wrap.prototype.on = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.on(this, sEventType, fCallback);
    });
};

/**
 * Unbind a handler to the first element
 * @param sEventType
 * @param fCallback
 * @returns {Function}
 */
jMVP.dom.Wrap.prototype.off = function(sEventType, fCallback) {
    return this.each(function() {
        jMVP.dom.off(this, sEventType, fCallback);
    });
};

/**
 * Add a CSS class name to element(s)
 * @param sClassName
 */
jMVP.dom.Wrap.prototype.addClass = function(sClassName) {
	return this.each(function() {
		this.className += ' ' + sClassName;
	});
};

/**
 * Remove a CSS class name to element(s)
 * @param sClassName
 */
jMVP.dom.Wrap.prototype.removeClass = function(sClassName) {
	return this.each(function() {
		this.className = this.className !== undefined ? this.className.replace(new RegExp(' ' + sClassName, 'gi'), '') : '';
	});
};

/**
 * Update the TEXT value of nodes
 * @param sValue
 */
jMVP.dom.Wrap.prototype.text = function(sValue) {
	return this.each(function() {
		this[jMVP.dom.INNER_TEXT] = sValue;
	});
};

/**
 * Update the innerHTML of nodes
 * @param sValue
 */
jMVP.dom.Wrap.prototype.html = function(sValue) {
	return this.each(function() {
		this.innerHTML = sValue;
	});
};

/**
 * Set/Update attribute key/value pair on nodes
 * @param sAttrKey
 * @param sAttrValue
 */
jMVP.dom.Wrap.prototype.setAttr = function(sAttrKey, sAttrValue) {
	return this.each(function() {
		this.setAttribute(sAttrKey, sAttrValue);
	});
};

/**
 * Remove a given attribute from nodes
 * @param sAttrKey
 */
jMVP.dom.Wrap.prototype.rmAttr = function(sAttrKey) {
	return this.each(function() {
		this.removeAttribute(sAttrKey);
	});
};


/**
 * Constants
 */

/**
 * Store property to use depending on the browser
 * @type {string}
 */
jMVP.dom.DIV = document.createElement('div');
jMVP.dom.INNER_TEXT = ('innerText' in jMVP.dom.DIV) ? 'innerText' : 'textContent';


/**
 * Static methods
 */

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
 * Return a off (event unbind) function compatible with the browser used
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
 * Return a getElementByClassName compatible with the browser used
 * @type {Function}
 */
jMVP.dom.getElementByClassName = jMVP.dom.DIV.querySelector
    ? function(sSelector, context) {
        return context.querySelector('.' + sSelector);
    }
    : function(sSelector, context) {
        var aResult = [];

        jMVP.dom(context.getElementsByTagName('*')).each(function() {
            if (this.className.indexOf(sSelector) !== -1) {
                aResult.push(this);
                return;
            }
        });

        return aResult[0];
    };


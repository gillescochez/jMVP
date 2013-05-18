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
        this.view.oMap[sKey] && this.view.update(sKey, vValue);
    }, this);
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
 * CSS Prefix used when creating new elements
 * @type {String}
 */
jMVP.CSS_PREFIX = 'jmvp-';

/**
 * Used to store models declared using jMVP
 * @type {{}}
 */
jMVP.oModels = {};

/**
 * Used to stored views declared using jMVP
 * @type {{}}
 */
jMVP.oViews = {};

/**
 * Used to store presenters declared using jMVP
 * @type {{}}
 */
jMVP.oPresenters = {};

/**
 * Load resources and return a jMVP instance built using those resources
 * @param sReference {String} The name of the jvmp package to load
 * @param fCallback {Function} The callback function
 *
 * @example
 *
 * jMVP.load('random', function(oJMVP) {
 *      oJMVP.model.foo.setValue('boo');
 * });
 *
 */
jMVP.load = function(sReference, fCallback) {
    console.log(sReference, fCallback);
};

/**
 * Declare a new jMVP static model object
 * @param sReference {String} The model name/reference
 * @param oModel {Object} The actual model configuration object
 *
 * @example
 *
 * jMVP.model('random', {
 *      foo: 'bla'
 * });
 *
 */
jMVP.model = function(sReference, oModel){
    jMVP.oModels[sReference] = oModel;
};

/**
 * Return a raw object model declared using jMVP
 * @param sReference
 * @returns {*|null}
 */
jMVP.getModel = function(sReference) {
    return jMVP.oModels[sReference] || null;
};

/**
 * Reurn a raw object view declared using jMPV
 * @param sReference
 * @returns {*|null}
 */
jMVP.getView = function(sReference) {
    return jMVP.oViews[sReference] || null;
};


/**
 * Reurn a raw object presenter declared using jMPV
 * @param sReference
 * @returns {*|null}
 */
jMVP.getPresenter = function(sReference) {
    return jMVP.oPresenters[sReference] || null;
};

/**
 * Declare a new jMVP static view object
 * @param sReference {String} The view name/reference
 * @param oView {Object} The actual view configuration object
 *
 * @example
 *
 * jMVP.view('random', {
 *      test: {
 *          text: 'foo'
 *      }
 * });
 *
 */
jMVP.view = function(sReference, oView){
    jMVP.oViews[sReference] = oView;
};

/**
 * Declare a new jMVP static presenter object
 * @param sReference {String} The presenter name/reference
 * @param oPresenter {Object} The actual presenter configuration object
 *
 * @example
 *
 * jMVP.presenter('random', {
 *      test: {
 *          click: function() {
 *              alert('clicked');
 *          }
 *      }
 * });
 */
jMVP.presenter = function(sReference, oPresenter){
    jMVP.oPresenters[sReference] = oPresenter;
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
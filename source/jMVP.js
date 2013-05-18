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
 * CSS Prefix used when creating new elements
 * @type {String}
 */
jMVP.CSS_PREFIX = 'jmvp-';

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
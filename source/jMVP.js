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
 * var oModel = {
 *      hello: 'Hellow World'
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

    // TODO do we actually need these?
    this.oRawModel = oRawModel;
    this.oRawView = oRawView;
    this.oRawPresenter = oRawPresenter;

    this.model = new jMVP.Model(oRawModel);
    this.view = new jMVP.View(oRawView);
    this.presenter = new jMVP.Presenter(oRawPresenter, this.view, this.model);

    this.model.onModelUpdated = function(sKey, vValue) {
        this.view.update(sKey, vValue);
    }.bind(this);
};

/**
 * CSS Prefix used when creating new elements
 * @type {string}
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
 * Load resources and return a jMVP instance using those resources
 * @param sReference {String} The name of the jvmp package to load
 * @param fCallback {Function} The callback function
 */
jMVP.load = function(sReference, fCallback) {
    console.log(sReference, fCallback);
};

/**
 * Declare a new jMVP static model object
 * @param sReference {String} The model name/reference
 * @param oModel {Object} The actual model configuration object
 */
jMVP.model = function(sReference, oModel){
    jMVP.oModels[sReference] = oModel;
};

/**
 * Declare a new jMVP static view object
 * @param sReference {String} The view name/reference
 * @param oView {Object} The actual view configuration object
 */
jMVP.view = function(sReference, oView){
    jMVP.oViews[sReference] = oView;
};

/**
 * Declare a new jMVP static presenter object
 * @param sReference {String} The presenter name/reference
 * @param oPresenter {Object} The actual presenter configuration object
 */
jMVP.presenter = function(sReference, oPresenter){
    jMVP.oPresenters[sReference] = oPresenter;
};

/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param vData {*} The data to iterate over
 * @param fCallback {Function} The callback function
 * @param [oContext] {{}} The object context used to run the callback in
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
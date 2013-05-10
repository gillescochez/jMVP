/**
 * Create a new jMVP instance
 * @param oMVPModel
 * @param oMVPView
 * @param oMVPPresenter
 */
var jMVP = function(oMVPModel, oMVPView, oMVPPresenter) {

};

/**
 * Load resources and return a jMVP instance using those resources
 * @param sReference
 * @param fCallback
 */
jMVP.import = function(sReference, fCallback) {

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

};

/**
 * Iterate over object, string and arrays and run a give function on each iteration
 * @param vData
 * @param fCallback
 * @param [oContext]
 */
jMVP.each = function(vData, fCallback, oContext) {

	var aData, sKey;

	if (vData.constructor === Object && vData.constructor !== Array) {

		for (sKey in vData) {

			if (vData[sKey]) {
				fCallback.apply(oContext, [sKey, vData[sKey]]);
			}
		}

	} else if (typeof vData === "string" || vData instanceof Array) {

		if (typeof vData === "string") {
			aData = vData.split("");
		} else {
			aData = vData;
		};

		// TODO write a Array.prototype.forEach shim
		aData.forEach(function(vValue, nIdx) {
			fCallback.apply(oContext, [vValue, nIdx]);
		});
	}
};
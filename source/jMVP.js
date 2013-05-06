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
 * @param sModelUrl
 * @param sViewUrl
 * @param sPresenterUrl
 */
jMVP.import = function(sModelUrl, sViewUrl, sPresenterUrl, fCallback) {

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

			if (vData.hasOwnProperty(sKey)) {
				fCallback.apply(oContext, [sKey, vData[sKey]]);
			}
		}

	} else if (typeof vData === "string" || vData instanceof Array) {

		if (typeof vData === "string") {
			aData = vData.split("");
		} else {
			aData = vData;
		};

		aData.forEach(function(vValue, nIdx) {
			fCallback.apply(oContext, [vValue, nIdx]);
		});
	}
};
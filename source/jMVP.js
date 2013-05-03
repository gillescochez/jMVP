/**
 * Create a new jMVP instance
 * @param oMVPModel
 * @param oMVPView
 * @param oMVPPresenter
 */
var jMVP = function(oMVPModel, oMVPView, oMVPPresenter) {

};

/**
 * Convert a normal object model into a jMVC Model
 * @param oModel
 * @constructor
 */
jMVP.Model = function(oModel) {

	this.model = oModel;

	for( var prop in oModel) {

	}
};

jMVP.Data = function(sKey, vValue) {
	this.sKey = sKey;
	this.vValue = vValue;
};

/**
 * jMVP View object constructor
 * @constructor
 */
jMVP.View = function() {

};

/**
 * jMVP Presenter object constructor
 * @constructor
 */
jMVP.Presenter = function(object) {

};
/**
 * Load resources and return a jMVP instance using those resources
 * @param sModelUrl
 * @param sViewUrl
 * @param sPresenterUrl
 */
jMVP.import = function(sModelUrl, sViewUrl, sPresenterUrl) {

};
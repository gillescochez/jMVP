/**
 * jMVP Model object constructor
 * @param oModel
 * @constructor
 */
jMVP.Model = function(oModel) {

	// store raw model
	this._ = oModel;

	// create model API
	for(var sKey in oModel) {
		this[sKey] = new jMVP.Data(oModel[sKey]);
		this[sKey].onValueUpdated = function(vValue) {
			oModel[sKey] = vValue;
		};
	}
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
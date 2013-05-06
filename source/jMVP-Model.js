/**
 * jMVP Model object constructor
 * @param oModel
 * @constructor
 */
jMVP.Model = function(oModel) {

	var sKey;

	// create model API
	for (sKey in oModel) {
		jMVP.Model.dataBind(this, oModel, sKey);
	}

	// store raw model reference
	this._ = oModel;
};

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
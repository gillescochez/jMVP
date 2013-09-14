/**
 * jMVP Model object constructor
 * @param model {{}} Model data object
 *
 * @example
 *
 * var model = new jJVM.Model({
 *      foo: 'foo',
 *      isEnabled: false,
 *      list: ['a', 'b'],
 *      obj: {a:true, b:false}
 * });
 *
 * @constructor
 */
jMVP.Model = function(model) {

	jMVP.each(model, function(key) {
		jMVP.Model.dataBind(this, model, key);
	}, this);
};

/**
 * Get called when a data object get updated
 * @param sKey {String} Model key which has its value updated
 * @param vValue {*} The updated value
 */
jMVP.Model.prototype.onModelUpdated = function(key, value) {};

/**
 * Create the setter/getter API and keep the raw data sync
 * @param instance {Object} jMVP.Model object instance
 * @param model {Object} Raw model object
 * @param key {String} The string being bind
 */
jMVP.Model.dataBind = function(instance, model, key) {

    instance[key] = function(value) {
        if (value !== undefined) instance[key].oData.setValue(value);
        return instance[key].oData.getValue();
    };

	instance[key].oData = new jMVP.Data(model[key]);

    instance[key].oData.onValueUpdated = function(value) {
		model[key] = value;
        instance.onModelUpdated.apply(instance, [key, value]);
	};
};

/**
 * jMVP Data object constructor
 * @param value {*} Original value to store
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
jMVP.Data = function(value) {
	this.value = value;
};

/**
 * Set the new value for the Data object
 * @param value {*} The new data for the current instance
 */
jMVP.Data.prototype.setValue = function(value) {
	this.value = value;
	this.onValueUpdated(this.value);
};

/**
 * Return the current value stored in the data object
 * @returns {*} The currently stored value
 */
jMVP.Data.prototype.getValue = function() {
	return this.value;
};

/**
 * Callback function of the setter, the updated value is passed as argument
 * @param vValue {*} The model updated value
 */
jMVP.Data.prototype.onValueUpdated = function(value){};
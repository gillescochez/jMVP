/**
 * Create a new jMVP instance
 * @param oRawModel
 * @param oRawView
 * @param oRawPresenter
 */
function jMVP(oRawModel, oRawView, oRawPresenter) {

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
}

/**
 * Render the DOM view to the given target
 * @param eTarget
 */
jMVP.prototype.render = function(eTarget) {
    eTarget.appendChild(this.view.eDomView);
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
 * @param sReference
 * @param fCallback
 */
jMVP.load = function(sReference, fCallback) {
    console.log(sReference, fCallback);
};

/**
 * Declare a new jMVP static view object
 * @param sReference
 * @param oView
 */
jMVP.view = function(sReference, oView){
    jMVP.oViews[sReference] = oView;
};

/**
 * Declare a new jMVP static model object
 * @param sReference
 * @param oModel
 */
jMVP.model = function(sReference, oModel){
    jMVP.oModels[sReference] = oModel;
};

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

		(typeof vData === "string" ? vData.split("") : vData).forEach(function(vValue, nIdx) {
			fCallback.apply(oContext, [vValue, nIdx]);
		});
	}
};
/**
 * jMVP Presenter object constructor
 *
 * @prop oMap {{}} View reference based map of handler objects
 * @prop view {{}} Store the jMVP.View instance if any passed
 * @prop model {{}} Store the jMVP.Model instance if any passed
 *
 * @param oConfig {{}} Presenter configuration object
 * @param [oView] {{}} jMVP.View instance object
 * @param [oModel] {{}} jMVP.Model instance object
 *
 * @example
 *
 * var oPresenterConfig = {
 *      foo: {
 *          click: function() {}
 *      }
 * };
 *
 * var oPresenter = new jMVP.Presenter(oPresenterConfig, oView, oModel);
 *
 * @constructor
 */
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.view = oView || null;
    this.model = oModel || null;
    this.oConfig = oConfig;

	jMVP.each(oConfig, function(sReference, oHandlers) {
		this.oMap[sReference] = oHandlers;
        this.view && this.bindToView(sReference);
	}, this);

};

/**
 * Bind element in a view with the handler matching its reference
 * @param sReference {String} View element reference name
 */
jMVP.Presenter.prototype.bindToView = function(sReference) {

    var oView = this.view,
        oModel = this.model;

    jMVP.each(this.oMap[sReference], function(sEventType, fHandler) {
        var eNode = this.view.getElement(sReference);
        jMVP.dom(eNode).on(sEventType, function(oEvent) {
            fHandler.apply(eNode, [oEvent, oModel, oView]);
        });
    }, this);
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param oDOMEvent {Object} The event object given by the DOM
 */
jMVP.Presenter.prototype.routeEvent = function(oDOMEvent) {

	var eNode = oDOMEvent.target,
		sReference;

	jMVP.each(eNode.className.indexOf(' ') !== -1 ? eNode.className.split(' ') : [eNode.className], function(sClassName) {

		if (sClassName.substring(0, 4) === 'jMVP') {

			sReference = sClassName.substring(5, sClassName.length);

			if (this.oMap.hasOwnProperty(sReference)) {

				if (this.oMap[sReference][oDOMEvent.type]) {
					// TODO What to use as context?
                    this.oMap[sReference][oDOMEvent.type].apply(eNode, [oDOMEvent, this.view, this.model])
				}
			}
		}
	}, this);
};

/**
 * Config object getter
 */
jMVP.Presenter.prototype.getConfig = function() {
    return this.oConfig;
};

/**
 * Map object getter
 */
jMVP.Presenter.prototype.getMap = function() {
    return this.oMap;
};

/**
 * Check if a key is in the map
 * @param sKey
 * @returns {boolean}
 */
jMVP.Presenter.prototype.isInMap = function(sKey) {
    return this.oMap[sKey] ? true : false;
};

/**
 * Model instance object getter
 */
jMVP.Presenter.prototype.getModel = function() {
    return this.model;
};

/**
 * View instance object getter
 */
jMVP.Presenter.prototype.getView = function() {
    return this.view;
};
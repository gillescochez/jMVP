/**
 * jMVP Presenter object constructor
 * @param oConfig
 * @param [oView]
 * @param [oModel]
 * @constructor
 */
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.oView = oView || null;
    this.oModel = oModel || null;

	jMVP.each(oConfig, function(sReference, oHandlers) {
		this.oMap[sReference] = oHandlers;
        this.oView && this.bindToView(sReference);
	}, this);

};

/**
 * Bind element in a view with the handler matching its reference
 * @param sReference
 */
jMVP.Presenter.prototype.bindToView = function(sReference) {

    var oView = this.oView,
        oModel = this.oModel;

    jMVP.each(this.oMap[sReference], function(sEventType, fHandler) {
        var eNode = jMVP.dom(this.oView.eDomView).getByClass(jMVP.CSS_PREFIX + sReference);
//        jMVP.dom(eNode).on(sEventType, function(oEvent) {
//            fHandler.apply(eNode, [oEvent, oModel, oView]);
//        });
    }, this);
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param oDOMEvent
 */
jMVP.Presenter.prototype.routeEvent = function(oDOMEvent) {

	var eNode = oDOMEvent.target,
		sReference;

	jMVP.each(eNode.className.indexOf(' ') !== -1 ? eNode.className.split(' ') : [eNode.className], function(sClassName) {

		if (sClassName.substring(0, 4) === 'jMVP') {

			sReference = sClassName.substring(5, sClassName.length);

			if (this.oMap.hasOwnProperty(sReference)) {

				if (this.oMap[sReference].hasOwnProperty(oDOMEvent.type)) {
					// TODO What to use as context?
                    this.oMap[sReference][oDOMEvent.type].apply(eNode, [oDOMEvent, this.oView, this.oModel])
				}
			}
		}
	}, this);
};
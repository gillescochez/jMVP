/**
 * jMVP Presenter object constructor
 * @param oConfig
 * @param [oView]
 * @param [oModel]
 * @constructor
 */
// TODO add oView, oModel as optional arguments and store them is present
jMVP.Presenter = function(oConfig, oView, oModel) {

	this.oMap = {};
    this.oView = oView;
    this.oModel = oModel;

	jMVP.each(oConfig, function(sReference, oHandlers) {
		this.oMap[sReference] = oHandlers;
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
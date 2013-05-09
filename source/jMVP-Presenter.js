/**
 * jMVP Presenter object constructor
 * @param oConfig
 * @constructor
 */
jMVP.Presenter = function(oConfig) {

	this.oMap = {};

	jMVP.each(oConfig, function(sReference, oHandlers) {
		this.oMap[sReference] = oHandlers;
	}, this);
};

/**
 *
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
                    this.oMap[sReference][oDOMEvent.type].apply(eNode, [oDOMEvent])
				}
			}
		}
	}, this);
};
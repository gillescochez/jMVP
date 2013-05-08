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

jMVP.Presenter.prototype.trigger = function(oDOMEvent) {
	var eNode = oDOMEvent.target,
		sReference;

	jMVP.each(eNode.className.split(' '), function(sClassName) {
		
		if (sClassName.substring(0, 4) === 'jMVP') {
			sReference = sClassName.substring(5, sClassName.length);

			if (this.oMap.hasOwnProperty(sReference)) {
				if (this.oMap[sReference].hasOwnProperty(oDOMEvent.type)) {
					console.log('execute');
				}
			}
		}
	});
};
/**
 * jMVP View object constructor
 * @param oView
 * @constructor
 */
jMVP.View = function(oView) {
	this.oRawView = oView;
	this.convertView();
};

jMVP.View.prototype.convertView = function(){
	this.sHtmlView = '';
	jMVP.each(this.oRawView, function(oValue) {
		this.sHtmlView += jMVP.View.objectToHtml(oValue);
	}, this);
};

jMVP.View.objectToHtml = function(oObject) {
	return '...';
};
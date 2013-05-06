/**
 * jMVP View object constructor
 * @param [oTemplate]
 * @constructor
 */
jMVP.View = function(oTemplate) {
	this.oTemplate = oTemplate || new jMVP.Template();
};

jMVP.View.prototype.bindTemplate = function(){};

/**
 * jMVP Template object constructor
 * @constructor
 */
jMVP.Template = function() {
	this.eRoot = document.createElement('div');
};

jMVP.Template.prototype.addElement = function(){};
jMVP.Template.prototype.removeElement = function(){};
jMVP.Template.prototype.updateElement = function(){};

/**
 * jMVP Element object constructor
 * @constructor
 */
jMVP.Element = function(){};

jMVP.Element.prototype.append = function(){};
jMVP.Element.prototype.prepend = function(){};
jMVP.Element.prototype.html = function(){};
jMVP.Element.prototype.text = function(){};
jMVP.Element.prototype.attr = function(){};
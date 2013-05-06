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
	this.eRoot = new jMVP.Element();
};

jMVP.Template.prototype.addElement = function(){};
jMVP.Template.prototype.removeElement = function(){};
jMVP.Template.prototype.updateElement = function(){};

/**
 * jMVP Element object constructor
 * @param [sTagName] Custom nodeName
 * @constructor
 */
jMVP.Element = function(sTagName){
	this.eElement = document.createElement(sTagName || 'div');
};

jMVP.Element.prototype.append = function(eElement){
	this.eElement.appendChild(eElement);
};
jMVP.Element.prototype.prepend = function(){};
jMVP.Element.prototype.html = function(){};
jMVP.Element.prototype.text = function(){};
jMVP.Element.prototype.attr = function(){};
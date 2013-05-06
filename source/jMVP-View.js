/**
 * jMVP View object constructor
 * @param [oTemplate]
 * @constructor
 */
jMVP.View = function(oTemplate) {
	this.oTemplate = oTemplate || new jMVP.Template();
};

/**
 * Return the template object of the view instance
 * @returns {object}
 */
jMVP.View.prototype.getTemplate = function() {
	return this.oTemplate;
};

/**
 * Set the template object of the view instance
 * @param oTemplate
 */
jMVP.View.prototype.setTemplate = function(oTemplate) {
	this.oTemplate = oTemplate;
};

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
 * @param [sTagName] Tag to use instead of default
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
jMVP.Element.prototype.attr = function(sAttrKey, sAttrValue){};
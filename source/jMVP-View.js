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
 * Render the view to a given element
 * @param eTarget
 */
jMVP.View.prototype.render = function(eTarget) {
	eTarget.appendChild(this.oTemplate.getElement());
};

/**
 * jMVP Template object constructor
 * @constructor
 */
jMVP.Template = function() {
	this.oRoot = new jMVP.Element();
	this.oElements = {};
};

/**
 * Return the template DOM element
 * @returns {object}
 */
jMVP.Template.prototype.getElement = function(){
	return this.oRoot.eElement;
};

/**
 * Add an element to the current template instance
 * @param oElementConfig
 */
jMVP.Template.prototype.addElement = function(oElementConfig){

	if (!oElementConfig.hasOwnProperty('id')) {
		throw "addElement: id property must be provided";
	};

	this.oElements[oElementConfig.id] = oElementConfig;
};

jMVP.Template.prototype.removeElement = function(oElementReference){};
jMVP.Template.prototype.updateElement = function(oElementReference){};

/**
 * jMVP Element object constructor
 * @param [sTagName] Tag to use instead of default
 * @constructor
 */
jMVP.Element = function(sTagName){
	this.eElement = document.createElement(sTagName || 'div');
};

/**
 * Append a DOM element into the current element
 * @param eElement
 */
jMVP.Element.prototype.append = function(eElement){
	this.eElement.appendChild(eElement);
};
jMVP.Element.prototype.prepend = function(){};
jMVP.Element.prototype.html = function(){};
jMVP.Element.prototype.text = function(){};
jMVP.Element.prototype.attr = function(sAttrKey, sAttrValue){};
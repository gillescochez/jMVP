/**
 * jMVP View object constructor
 * @constructor
 */
jMVP.View = function() {
	this.oTemplate = new jMVP.Template();
};

/**
 * jMVP Template object constructor
 * @constructor
 */
jMVP.Template = function() {
	this.eRoot = document.createElement('div');
};
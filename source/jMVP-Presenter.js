/**
 * jMVP Presenter object constructor
 *
 * @prop oMap {{}} View reference based map of handler objects
 * @prop view {{}} Store the jMVP.View instance if any passed
 * @prop model {{}} Store the jMVP.Model instance if any passed
 *
 * @param config {{}} Presenter configuration object
 * @param [view] {{}} jMVP.View instance object
 * @param [model] {{}} jMVP.Model instance object
 *
 * @example
 *
 * var oPresenterConfig = {
 *      foo: {
 *          click: function() {}
 *      }
 * };
 *
 * var oPresenter = new jMVP.Presenter(oPresenterConfig, view, model);
 *
 * @constructor
 */
// TODO Improve event binding, we want to use delegation
jMVP.Presenter = function(config, view, model) {

	this.map = {};
    this.view = view || null;
    this.model = model || null;
    this.config = config;

	jMVP.each(config, function(ref, handlers) {
        this.map[ref] = handlers;
        this.view && this.bindToView(ref);
	}, this);
};

/**
 * Bind element in a view with the handler matching its reference
 * @param ref {String} View element reference name
 */
jMVP.Presenter.prototype.bindToView = function(ref) {

    var view = this.view,
        model = this.model;

    jMVP.each(this.map[ref], function(eventType, handler) {

        var node = view.getNode(ref);

        jMVP.dom(node).on(eventType, function(event) {
            handler.apply(node, [event, model, view]);
        });
    });
};

/**
 * route DOM Event to the right handler in the handlers Map
 * @param domEvent {Object} The event object given by the DOM
 */
jMVP.Presenter.prototype.routeEvent = function(domEvent) {

	var node = domEvent.target,
		ref;

	jMVP.each(node.className.indexOf(' ') !== -1 ? node.className.split(' ') : [node.className], function(name) {

		if (name.substring(0, 4) === 'jMVP') {

			ref = name.substring(5, name.length);

			if (this.map.hasOwnProperty(ref)) {

				if (this.map[ref][domEvent.type]) {
					// TODO What to use as context?
                    this.map[ref][domEvent.type].apply(node, [domEvent, this.view, this.model])
				}
			}
		}
	}, this);
};

/**
 * Config object getter
 * @returns {Object}
 */
jMVP.Presenter.prototype.getConfig = function() {
    return this.config;
};

/**
 * Map object getter
 * @returns {Object}
 */
jMVP.Presenter.prototype.getMap = function() {
    return this.map;
};

/**
 * Check if a key is in the map
 * @param key
 * @returns {boolean}
 */
jMVP.Presenter.prototype.isInMap = function(key) {
    return this.map[key] ? true : false;
};

/**
 * Model instance object getter
 * @returns {jMVP.Model}
 */
jMVP.Presenter.prototype.getModel = function() {
    return this.model;
};

/**
 * View instance object getter
 * @returns {jMVP.View}
 */
jMVP.Presenter.prototype.getView = function() {
    return this.view;
};
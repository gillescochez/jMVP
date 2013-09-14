/**
 * Create a new jMVP instance
 *
 * @prop rawModel {Object} The original model config object
 * @prop rawView {Object} The original model config object
 * @prop rawPresenter {Object} The original model config object
 * @prop model {Object} Instance of jMVP.Model
 * @prop view {Object} Instance of jMVP.View
 * @prop presenter {Object} Instance of jMVP.Presenter
 *
 * @param rawModel {Object} The original model object
 * @param rawView {Object} The view configuration object
 * @param rawPresenter {Object} The presenter configuration object
 *
 * @example
 *
 * var oModel = {
 *      hello: 'Hello World'
 * };
 *
 * var oView = {
 *      foo: {
 *          text: 'hello'
 *      }
 * };
 *
 * var oPresenter = {
 *      foo: {
 *          click: function(oDOMEvent, oModel, oView) {
 *
 *          }
 *      }
 * };
 *
 * var oJmvp = new jMVP(oModel, oView, oPresenter);
 *
 * @constructor
 */
var jMVP = function(rawModel, rawView, rawPresenter) {

    this.rawModel = rawModel;
    this.rawView = rawView;
    this.rawPresenter = rawPresenter;

    this.model = new jMVP.Model(rawModel);
    this.view = new jMVP.View(rawView, true);
    this.presenter = new jMVP.Presenter(rawPresenter, this.view, this.model);

    this.addModelListener();
    this.applyModelToView();
};

/**
 * Set the onModelUpdated listener
 */
jMVP.prototype.addModelListener = function() {
    this.model.onModelUpdated = function(key, value) {
        this.view.update(key, value);
    }.bind(this);
};

/**
 * Loop through all original data and update the view accordingly
 */
jMVP.prototype.applyModelToView = function() {
    jMVP.each(this.rawModel, function(key, value) {
        this.view.update(key, value);
    }, this);
};

/**
 * Getter for the original model configuration object
 * @returns {Object}
 */
jMVP.prototype.getModel = function(){
    return this.model;
};

/**
 * Getter for the original view configuration object
 * @returns {Object}
 */
jMVP.prototype.getView = function(){
    return this.view;
};

/**
 * Getter for the original presenter configuration object
 * @returns {Object}
 */
jMVP.prototype.getPresenter = function(){
    return this.presenter;
};

/**
 * Getter for the original model configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawModel = function(){
    return this.rawModel;
};

/**
 * Getter for the original view configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawView = function(){
    return this.rawView;
};

/**
 * Getter for the original presenter configuration object
 * @returns {Object}
 */
jMVP.prototype.getRawPresenter = function(){
    return this.rawPresenter;
};
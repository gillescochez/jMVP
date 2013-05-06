module('jMVP');
test('Objects / Static methods', function(){

	/**
	 * jMVP object
	 */

	ok(window.jMVP, 'jMVP exists');
	equal(typeof jMVP, 'function', 'jMVP is a function');
	equal(jMVP.length, 3, 'jMVP expect 3 arguments');

	ok(jMVP.each, 'jMVP.each exists');
	equal(typeof jMVP.each, 'function', 'jMVP.each is a function');
	equal(jMVP.each && jMVP.prototype.each === undefined, true, 'jMVP.each is static');
	equal(jMVP.each.length, 3, 'jMVP.each expect 3 arguments');

	ok(jMVP.import, 'jMVP.import exists');
	equal(typeof jMVP.import, 'function', 'jMVP.import is a function');
	equal(jMVP.import && jMVP.prototype.import === undefined, true, 'jMVP.import is static');
	equal(jMVP.import.length, 2, 'jMVP.import expect 2 arguments');

	ok(jMVP.model, 'jMVP.model exists');
	equal(typeof jMVP.model, 'function', 'jMVP.model is a function');
	equal(jMVP.model && jMVP.prototype.model === undefined, true, 'jMVP.model is static');
	equal(jMVP.model.length, 2, 'jMVP.model expect 2 arguments');

	ok(jMVP.oModels, 'jMVP.oModels exists');
	equal(typeof jMVP.oModels, 'object', 'jMVP.oModels is a object');
	equal(jMVP.oModels && jMVP.prototype.oModels === undefined, true, 'jMVP.oModels is static');

	ok(jMVP.view, 'jMVP.view exists');
	equal(typeof jMVP.view, 'function', 'jMVP.view is a function');
	equal(jMVP.view && jMVP.prototype.view === undefined, true, 'jMVP.view is static');
	equal(jMVP.view.length, 2, 'jMVP.view expect 2 arguments');

	ok(jMVP.oViews, 'jMVP.oViews exists');
	equal(typeof jMVP.oViews, 'object', 'jMVP.oViews is a object');
	equal(jMVP.oViews && jMVP.prototype.oViews === undefined, true, 'jMVP.oViews is static');

	ok(jMVP.presenter, 'jMVP.presenter exists');
	equal(typeof jMVP.presenter, 'function', 'jMVP.presenter is a function');
	equal(jMVP.presenter && jMVP.prototype.presenter === undefined, true, 'jMVP.presenter is static');
	equal(jMVP.presenter.length, 2, 'jMVP.presenter expect 2 arguments');

	ok(jMVP.oPresenters, 'jMVP.oPresenters exists');
	equal(typeof jMVP.oPresenters, 'object', 'jMVP.oPresenters is a object');
	equal(jMVP.oPresenters && jMVP.prototype.oPresenters === undefined, true, 'jMVP.oPresenters is static');

	/**
	 * jMVP View object
	 */

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');
	equal(jMVP.View.length, 1, 'jMVP.View expect 1 argument');

	ok(jMVP.Template, 'jMVP.Template exists');
	equal(typeof jMVP.Template, 'function', 'jMVP.Template is a function');
	equal(jMVP.prototype.Template, undefined, 'jMVP.Template is static');
	equal(jMVP.Template.length, 0, 'jMVP.Template expect 0 argument');

	ok(jMVP.Element, 'jMVP.Element exists');
	equal(typeof jMVP.Element, 'function', 'jMVP.Element is a function');
	equal(jMVP.prototype.Element, undefined, 'jMVP.Element is static');
	equal(jMVP.Element.length, 1, 'jMVP.Element expect 1 argument');

	/**
	 * jMVP Data object
	 */

	ok(jMVP.Data, 'jMVP.Data exists');
	equal(typeof jMVP.Data, 'function', 'jMVP.Data is a function');
	equal(jMVP.Data && jMVP.prototype.Data === undefined, true, 'jMVP.Data is static');
	equal(jMVP.Data.length, 1, 'jMVP.Data expect 1 argument');

	/**
	 * jMVP Model object
	 */

	ok(jMVP.Model, 'jMVP.Model exists');
	equal(typeof jMVP.Model, 'function', 'jMVP.Model is a function');
	equal(jMVP.Model && jMVP.prototype.Model === undefined, true, 'jMVP.Model is static');
	equal(jMVP.Model.length, 1, 'jMVP.Model expect 1 argument');

	ok(jMVP.Model.dataBind, 'jMVP.Model.dataBind exists');
	equal(typeof jMVP.Model.dataBind, 'function', 'jMVP.Model.dataBind is a function');
	equal(jMVP.Model.dataBind && jMVP.Model.prototype.dataBind === undefined, true, 'jMVP.Model is static');
	equal(jMVP.Model.dataBind.length, 3, 'jMVP.Model expect 3 arguments');

	/**
	 * jMVP Presenter object
	 */

	ok(jMVP.Presenter, 'jMVP.Presenter exists');
	equal(typeof jMVP.Presenter, 'function', 'jMVP.Presenter is a function');
	equal(jMVP.Presenter && jMVP.prototype.Presenter === undefined, true, 'jMVP.Presenter is static');
	equal(jMVP.Presenter.length, 1, 'jMVP.Presenter expect 1 argument');

});
test('jMVP.each static method', function() {

	var oData = {
			a: 'a',
			b:'b'
		},
		sData = 'ab',
		aData = ['c','d'],
		count = 0;

	// with object
	jMVP.each(oData, function(sKey, vValue) {
		equal(arguments.length, 2, '2 arguments in callback');
		equal(typeof sKey, 'string', 'key is string');
		count++;
	});
	equal(count, 2, 'each with object');

	// with string
	count = 0;
	jMVP.each(sData, function(vValue, nIdx) {
		equal(arguments.length, 2, '2 arguments in callback');
		equal(typeof nIdx, 'number', 'index is number');
		count++;
	});
	equal(count, 2, 'each with string');

	// with array
	count = 0;
	jMVP.each(aData, function(vValue, nIdx) {
		equal(arguments.length, 2, '2 arguments in callback');
		equal(typeof nIdx, 'number', 'index is number');
		count++;
	});

	equal(count, 2, 'each with array');
});

module('jMVP.Model');
test('Model / Data instances', function() {

	var oRawData = {
			foo: 'foo',
			boo:'boo'
		},
		oModel = new jMVP.Model(oRawData),
		oData = new jMVP.Data('a'),
		valueFromOnValueUpdated;

	ok(oData.vValue, 'value property');
	equal(oData.vValue, 'a', 'value is correct');

	ok(oData.getValue, 'data getter exists');
	ok(oData.setValue, 'data setter exists');
	ok(oData.onValueUpdated, 'data onValueUpdated callback exists');
	equal(typeof oData.getValue, 'function', 'getter is function');
	equal(typeof oData.setValue, 'function', 'setter is function');
	equal(typeof oData.onValueUpdated, 'function', 'onValueUpdated callback is function');
	oData.onValueUpdated = function(vValue) {
		valueFromOnValueUpdated = vValue;
	};
	oData.setValue('A');
	equal(valueFromOnValueUpdated, 'A', 'onValueUpdated return updated data');

	equal(oModel.foo.getValue(), 'foo', 'getValue return right data');
	oModel.foo.setValue('FOO');
	equal(oRawData.foo, 'FOO', 'original data update');
	equal(oModel.foo.getValue(), 'FOO', 'getValue return updated data');
});

module('jMVP.View');
test('View / Template / Element instances', function() {

	var oView = new jMVP.View(),
		oTemplate = new jMVP.Template(),
		oElement = new jMVP.Element(),
		div = document.createElement('div');

	/**
	 * jMVP.View instance
	 */
	ok(oView.oTemplate, 'oView.oTemplate exists');
	equal(oView.oTemplate.constructor, jMVP.Template, 'oView.oTemplate is an instance of jMVP.Template');

	ok(oView.getTemplate, 'oView.getTemplate method exists');
	equal(oView.getTemplate.length, 0, 'oView.getTemplate as 0 argument');
	deepEqual(oView.getTemplate(), oView.oTemplate, 'oView.getTemplate return oTemplate');

	ok(oView.setTemplate, 'oView.setTemplate method exists');
	equal(oView.setTemplate.length, 1, 'oView.setTemplate as 1 argument');

	ok(oView.render, 'oView.render method exists');
	equal(oView.render.length, 1, 'oView.render as 1 argument');
	oView.render(div);
	equal(div.innerHTML.toLowerCase(), '<div></div>', 'oView.render works');

	/**
	 * jMVP.Template instance
	 */
	ok(oTemplate.oRoot, 'oTemplate.oRoot property exists');
	equal(oTemplate.oRoot.constructor, jMVP.Element, 'oTemplate.oRoot is an instance of jMVP.Element');

	ok(oTemplate.oElements, 'oTemplate.oElements exists');
	equal(oTemplate.oElements.constructor, Object, 'oTemplate.oElements constructor is Object');

	ok(oTemplate.addElement, 'oTemplate.addElement method exists');
	equal(oTemplate.addElement.length, 1, 'oTemplate.addElement as 1 argument');
	var oElementTestConfig = {
		id: 'test'
	};
	oTemplate.addElement(oElementTestConfig);
	ok(oTemplate.oElements.test, 'oTemplate.oElements.test exists');
	deepEqual(oTemplate.oElements.test, oElementTestConfig, 'oTemplate.oElements.test stored properly');

	ok(oTemplate.removeElement, 'oTemplate.removeElement method exists');
	equal(oTemplate.removeElement.length, 1, 'oTemplate.removeElement as 1 argument');

	ok(oTemplate.updateElement, 'oTemplate.updateElement method exists');
	equal(oTemplate.updateElement.length, 1, 'oTemplate.updateElement as 1 argument');

	ok(oTemplate.getElement, 'oTemplate.getElement method exists');
	equal(oTemplate.getElement.length, 0, 'oTemplate.getElement as 0 argument');
	equal(oTemplate.getElement(), oTemplate.oRoot.eElement, 'oTemplate.getElement return right value');

	/**
	 * jMVP.Element instance
	 */
	ok(oElement.eElement, 'dom element exists');
	equal(oElement.eElement.outerHTML.toLowerCase(), '<div></div>', 'eRoot is empty div');

	ok(oElement.append, 'append exists');
	oElement.append(document.createElement('div'));
	equal(oElement.eElement.innerHTML.toLowerCase(), '<div></div>', 'eRoot contains an empty div');

	ok(oElement.prepend, 'append exists');
	ok(oElement.html, 'append exists');
	ok(oElement.text, 'append exists');
	ok(oElement.attr, 'append exists');
	equal(oElement.attr.length, 2, 'attr as 2 argument');
});
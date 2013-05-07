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
	equal(typeof jMVP.oModels, 'object', 'jMVP.oModels is an object');
	equal(jMVP.oModels && jMVP.prototype.oModels === undefined, true, 'jMVP.oModels is static');

	ok(jMVP.view, 'jMVP.view exists');
	equal(typeof jMVP.view, 'function', 'jMVP.view is a function');
	equal(jMVP.view && jMVP.prototype.view === undefined, true, 'jMVP.view is static');
	equal(jMVP.view.length, 2, 'jMVP.view expect 2 arguments');

	ok(jMVP.oViews, 'jMVP.oViews exists');
	equal(typeof jMVP.oViews, 'object', 'jMVP.oViews is an object');
	equal(jMVP.oViews && jMVP.prototype.oViews === undefined, true, 'jMVP.oViews is static');

	ok(jMVP.presenter, 'jMVP.presenter exists');
	equal(typeof jMVP.presenter, 'function', 'jMVP.presenter is a function');
	equal(jMVP.presenter && jMVP.prototype.presenter === undefined, true, 'jMVP.presenter is static');
	equal(jMVP.presenter.length, 2, 'jMVP.presenter expect 2 arguments');

	ok(jMVP.oPresenters, 'jMVP.oPresenters exists');
	equal(typeof jMVP.oPresenters, 'object', 'jMVP.oPresenters is an object');
	equal(jMVP.oPresenters && jMVP.prototype.oPresenters === undefined, true, 'jMVP.oPresenters is static');

	/**
	 * jMVP View object
	 */

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');
	equal(jMVP.View.length, 1, 'jMVP.View expect 1 argument');

	ok(jMVP.View.objectToElement, 'jMVP.View.objectToElement exists');
	equal(typeof jMVP.View.objectToElement, 'function', 'jMVP.View.objectToElement is a function');
	equal(jMVP.View.objectToElement && jMVP.View.prototype.objectToElement === undefined, true,
		'jMVP.View.objectToElement is static');
	equal(jMVP.View.objectToElement.length, 3, 'jMVP.View.objectToElement expect 3 arguments');

	ok(jMVP.View.viewFragmentHasChildren, 'jMVP.View.viewFragmentHasChildren exists');
	equal(typeof jMVP.View.viewFragmentHasChildren, 'function', 'jMVP.View.viewFragmentHasChildren is a function');
	equal(jMVP.View.viewFragmentHasChildren && jMVP.View.prototype.viewFragmentHasChildren === undefined, true,
		'jMVP.View.viewFragmentHasChildren is static');
	equal(jMVP.View.viewFragmentHasChildren.length, 1, 'jMVP.View.viewFragmentHasChildren expect 1 arguments');

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
	equal(jMVP.Model.dataBind && jMVP.Model.prototype.dataBind === undefined, true, 'jMVP.Model.dataBind is static');
	equal(jMVP.Model.dataBind.length, 3, 'jMVP.Model.dataBind expect 3 arguments');

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
test('View hooks', function() {

	ok(jMVP.View.hooks, 'jMVP.View.hooks exists');
	equal(typeof jMVP.View.hooks, 'object', 'jMVP.View.hooks is an object');
	equal(jMVP.View.prototype.hooks, undefined, 'jMVP.View.hooks is static');

	'text,html,visible,attributes,classNames'.split(',').forEach(function(hook) {

		ok(jMVP.View.hooks[hook], 'jMVP.View.hooks.' + hook + ' exists');
		equal(typeof jMVP.View.hooks[hook], 'function', 'jMVP.View.hooks.' + hook + ' is a function');
		equal(jMVP.View.hooks[hook].length, 2, 'jMVP.View.hooks.' + hook + ' expects 2 arguments');
	});

});

test('View / Template / Element instances', function() {

	var oModel = {foo:'foo'},
		oTmpl = {test:{
			text: 'foo'
		}},
		oView = new jMVP.View(oTmpl),
		div = document.createElement('div');

	/* More complex View structure
	{
		header: {},
		content: {
			side: {},
			main: {
				title: {
					tag: 'h1',
					text: 'pagetitle'
				},
				article: {
					text: 'pagecontent'
				}
			}
		}
	}
	*/

	/**
	 * jMVP.View instance
	 */
	ok(oView.oRawView, 'oRawView exists');
	deepEqual(oView.oRawView, oTmpl, 'oRawView === oTmpl');

	ok(oView.eDomView, 'eDomView exists');

	ok(oView.oMap, 'oMap exists');
	equal(typeof oView.oMap, 'object', 'oMap is an object');

	ok(oView.render, 'render exists');
	equal(typeof oView.render, 'function', 'render is a functgion');

	oView.render(div);

	equal(div.innerHTML, '<div><div class="jmvp-test"></div></div>', 'View rendered properly');

	ok(oView.update, 'update exists');
	equal(typeof oView.update, 'function', 'update is a function');
	equal(oView.update.length, 2, 'render expects 2 arguments');

	oView.update('foo', oModel.foo);

	equal(div.innerHTML, '<div><div class="jmvp-test">foo</div></div>', 'View rendered properly');
});

test('View hooks', function() {

});
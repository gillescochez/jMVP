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
	equal(jMVP.import.length, 4, 'jMVP.import expect 4 arguments');

	/**
	 * jMVP View object
	 */

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');
	equal(jMVP.View.length, 0, 'jMVP.View expect 0 argument');

	ok(jMVP.Template, 'jMVP.Template exists');
	equal(typeof jMVP.Template, 'function', 'jMVP.Template is a function');
	equal(jMVP.prototype.Template, undefined, 'jMVP.Template is static');
	equal(jMVP.Template.length, 0, 'jMVP.Template expect 0 argument');

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

test('each helper function', function() {

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
		console.log('aData: ', vValue, nIdx)
		equal(arguments.length, 2, '2 arguments in callback');
		equal(typeof nIdx, 'number', 'index is number');
		count++;
	});

	equal(count, 2, 'each with array');
});

test('Model / Data object instances', function() {

	var oRawData = {
			foo: 'foo',
			boo:'boo'
		},
		oModel = new jMVP.Model(oRawData),
		oData = new jMVP.Data('a');

	ok(oData.vValue, 'value property');
	equal(oData.vValue, 'a', 'value is correct');

	ok(oData.getValue, 'data getter exists');
	ok(oData.setValue, 'data setter exists');
	ok(oData.onValueUpdated, 'data onValueUpdated callback exists');
	equal(typeof oData.getValue, 'function', 'getter is function');
	equal(typeof oData.setValue, 'function', 'setter is function');
	equal(typeof oData.onValueUpdated, 'function', 'onValueUpdated callback is function');

	equal(oModel.foo.getValue(), 'foo', 'getValue return right data');

	oModel.foo.setValue('FOO');
	equal(oRawData.foo, 'FOO', 'original data update');
	equal(oModel.foo.getValue(), 'FOO', 'getValue return updated data');
});

test('View / Template object instance', function() {

	var oView = new jMVP.View(),
		oTemplate = new jMVP.Template();


});
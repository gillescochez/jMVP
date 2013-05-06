test('jMVP basic objects test', function(){

	ok(window.jMVP, 'jMVP exists');
	equal(typeof jMVP, 'function', 'jMVP is a function');
	equal(jMVP.length, 3, 'jMVP expect 3 arguments');

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');

	ok(jMVP.Data, 'jMVP.Data exists');
	equal(typeof jMVP.Data, 'function', 'jMVP.Data is a function');
	equal(jMVP.Data && jMVP.prototype.Data === undefined, true, 'jMVP.Data is static');
	equal(jMVP.Data.length, 1, 'jMVP.Data expect 1 arguments');

	ok(jMVP.Model, 'jMVP.Model exists');
	equal(typeof jMVP.Model, 'function', 'jMVP.Model is a function');
	equal(jMVP.Model && jMVP.prototype.Model === undefined, true, 'jMVP.Model is static');
	equal(jMVP.Model.length, 1, 'jMVP.Model expect 1 arguments');

	ok(jMVP.Presenter, 'jMVP.Presenter exists');
	equal(typeof jMVP.Presenter, 'function', 'jMVP.Presenter is a function');
	equal(jMVP.Presenter && jMVP.prototype.Presenter === undefined, true, 'jMVP.Presenter is static');
	equal(jMVP.Presenter.length, 1, 'jMVP.Presenter expect 1 arguments');

	ok(jMVP.import, 'jMVP.import exists');
	equal(typeof jMVP.import, 'function', 'jMVP.import is a function');
	equal(jMVP.import && jMVP.prototype.import === undefined, true, 'jMVP.import is static');
	equal(jMVP.import.length, 3, 'jMVP.import expect 3 arguments');

});

test('jMVP Model and Data objects tests', function() {

	var oModel = new jMVP.Model({
			foo: 'foo'
		}),
		oData = new jMVP.Data('a');

	ok(oData.vValue, 'value property');
	equal(oData.vValue, 'a', 'value is correct');

	ok(oData.getValue, 'data getter exists');
	ok(oData.setValue, 'data setter exists');
	ok(oData.onValueUpdated, 'data onValueUpdated callback exists');
	equal(typeof oData.getValue, 'function', 'getter is function');
	equal(typeof oData.setValue, 'function', 'setter is function');
	equal(typeof oData.onValueUpdated, 'function', 'onValueUpdated callback is function');

	ok(oModel._, 'object to store original modal');
	equal(oModel._.foo, 'foo', 'original data stored');
	equal(oModel.foo.getValue(), 'foo', 'getValue return right data');

	oModel.foo.setValue('FOO');
	equal(oModel._.foo, 'FOO', 'original data update');
	equal(oModel.foo.getValue(), 'FOO', 'getValue return updated data');
});
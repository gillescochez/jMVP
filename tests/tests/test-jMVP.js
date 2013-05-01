test('jMVP basic objects test', function(){

	ok(window.jMVP, 'jMVP exists');
	equal(typeof jMVP, 'function', 'jMVP is a function');
	equal(jMVP.length, 3, 'jMVP expect 3 arguments')

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');

	ok(jMVP.Presenter, 'jMVP.Presenter exists');
	equal(typeof jMVP.Presenter, 'function', 'jMVP.Presenter is a function');
	equal(jMVP.prototype.Presenter, undefined, 'jMVP.View is static');

});
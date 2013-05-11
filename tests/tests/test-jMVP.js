module('jMVP');
test('Objects / Static methods - basic', function(){

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

    /**
     * Object Declaration API
     */

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
	equal(jMVP.Presenter.length, 3, 'jMVP.Presenter expect 3 argument');

});
test('jMVP.each static method - functional', function() {

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
test('Model / Data instances - functional', function() {

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
test('View / Template / Element instances - functional', function() {

	var oModel = {foo:'foo'},
		oTmpl = {test:{
			text: 'foo'
		}},
		oView = new jMVP.View(oTmpl),
		div = document.createElement('div');

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

	equal(div.innerHTML, '<div><div class="jmvp-test">foo</div></div>', 'Basic hook test');
});
test('View hooks', function() {

	ok(jMVP.View.hooks, 'jMVP.View.hooks exists');
	equal(typeof jMVP.View.hooks, 'object', 'jMVP.View.hooks is an object');
	equal(jMVP.View.prototype.hooks, undefined, 'jMVP.View.hooks is static');

	'text,html,visible,attributes,classNames'.split(',').forEach(function(hook) {

		ok(jMVP.View.hooks[hook], 'jMVP.View.hooks.' + hook + ' exists');
		equal(typeof jMVP.View.hooks[hook], 'function', 'jMVP.View.hooks.' + hook + ' is a function');
		if (hook == 'classNames' || hook == 'attributes') {
			equal(jMVP.View.hooks[hook].length, 3, 'jMVP.View.hooks.' + hook + ' expects 3 arguments');
		} else {
			equal(jMVP.View.hooks[hook].length, 2, 'jMVP.View.hooks.' + hook + ' expects 2 arguments');
		}
	});

	var oModel = {
			pagetitle: 'test',
			pagecontent: '<p>Bla bla bla</p>',
			hideTitle: true
		},
		oTmpl = {
			header: {},
			content: {
				side: {},
				main: {
					title: {
						tag: 'h1',
						text: 'pagetitle',
						attributes: {
							title: 'pagetitle'
						},
						classNames: {
							visible: 'hideTitle'
						}
					},
					article: {
						html: 'pagecontent',
						attributes: {
							title: 'pagetitle'
						}
					}
				}
			}
		},
		oView = new jMVP.View(oTmpl),
		div = document.createElement('div'),
		updatedHtml = '<div><div class="jmvp-header"></div><div class="jmvp-content"><div class="jmvp-side"></div><div class="jmvp-main"><h1 class="jmvp-title visible" title="test">test</h1><div class="jmvp-article" title="test"><p>Bla bla bla</p></div></div></div></div>',
		emptyHtml = '<div><div class="jmvp-header"></div><div class="jmvp-content"><div class="jmvp-side"></div><div class="jmvp-main"><h1 class="jmvp-title"></h1><div class="jmvp-article"></div></div></div></div>';

	oView.render(div);

	equal(div.innerHTML, emptyHtml, 'Complex view markup');

	oView.update('pagetitle', oModel.pagetitle);
	oView.update('pagecontent', oModel.pagecontent);
	oView.update('hideTitle', oModel.hideTitle);

	equal(div.innerHTML, updatedHtml, 'text and html hooks');
});

module('jMVP.dom');
test('dom helper / Wrap class - basic / functional', function() {

	var aMethods = 'each,addClass,removeClass,text,html,rmAttr,setAttr,getByClass'.split(','),
		div = document.createElement('div'),
		divDom,
		aDiv = [
			document.createElement('div'),
			document.createElement('div')
		],
		total = aDiv.length,
		count = 0;

	/**
	 * Basic tests
	 */
    ok(jMVP.dom, '.dom exists');
    equal(typeof jMVP.dom, 'function', '.dom is a function');

	ok(jMVP.dom.Wrap, '.dom.Wrap exists');
	equal(typeof jMVP.dom.Wrap, 'function', '.dom.Wrap is a function');

    ok(jMVP.dom.getElementsByClassName, '.dom.getElementsByClassName exists');
    equal(typeof jMVP.dom.getElementsByClassName, 'function', '.dom.getElementsByClassName is a function');

    ok(jMVP.dom.DIV, 'DIV constant exists');
    ok(jMVP.dom.INNER_TEXT, 'INNER_TEXT constant exists');

	aMethods.forEach(function(sMethod) {
		ok(jMVP.dom.Wrap.prototype[sMethod], 'jMVP.dom.Wrap.prototype.' + sMethod + ' exists');
		equal(typeof jMVP.dom.Wrap.prototype[sMethod], 'function', 'jMVP.dom.Wrap.prototype.' + sMethod + ' is a function');
	});

	/**
	 * Functionality tests
	 */
	//TODO Move text and html test from View hooks into here
	divDom = jMVP.dom(div);
	deepEqual(divDom.constructor, jMVP.dom.Wrap, 'dom method return an instance of dom.Wrap');
	deepEqual(divDom.aNodes[0], div, 'element is stored');

	// testing each
	jMVP.dom(aDiv).each(function() {
		deepEqual(aDiv[count], this, 'correct node');
		count++;
	});
	equal(count, total, 'each iterated correctly');

	divDom.addClass('foo');
	equal(divDom.aNodes[0].className, ' foo', 'addClass success');
	divDom.removeClass('foo');
	equal(divDom.aNodes[0].className, '', 'removeClass success');

	divDom.setAttr('foo', 'yes');
	equal(divDom.aNodes[0].getAttribute('foo'), 'yes', 'setAttr success');
	divDom.rmAttr('foo');
	equal(divDom.aNodes[0].getAttribute('foo'), null, 'rmAttr success');

    var span = document.createElement('span');
    span.className = 'test';
    div.appendChild(span);

    deepEqual(jMVP.dom(div).getByClass('test'), span, 'dom.getByClass works');

    // reset divDom before chain test as can affect test above
    divDom = jMVP.dom(document.createElement('div'));
	aMethods.forEach(function(sMethod) {
        // skip getByClass as returning an array
        if (sMethod != 'getByClass') {
            if (sMethod == 'each') deepEqual(divDom[sMethod](function(){}), divDom, sMethod + ' chained');
            else deepEqual(divDom[sMethod]('a'), divDom, sMethod + ' chained');
        }
	});

    ok(jMVP.dom.on, 'on exists');
    equal(typeof jMVP.dom.on, 'function', 'on is a function');
    equal(jMVP.dom.on.length, 3, 'on expects 2 arguments');
    equal(typeof divDom.on, 'undefined', 'on is static');

    ok(jMVP.dom.off, 'off exists');
    equal(typeof jMVP.dom.off, 'function', 'off is a function');
    equal(jMVP.dom.off.length, 3, 'off expects 2 arguments');
    equal(typeof divDom.off, 'undefined', 'off is static');


});

module('jMVP.Presenter');
test('Presenter instance - basic / functional', function() {

	var clicked = false,
        div = document.createElement('div');

    div.className = 'jMVP-test';

    var mockEvent = {
            target: div,
            type: 'click'
        },
        handlers = {
			test: {
				click: function() {
                    clicked = true;
				}
			}
		},
        view = {
            test: {
                text: 'foo'
            }
        },
        model = {
            foo: 'foo'
        },
		presenter = new jMVP.Presenter(handlers);

	ok(presenter.oMap, 'Map exists');
	ok(presenter.oMap.test, 'data stored in map');
    deepEqual(presenter.oMap, handlers, 'data stored properly');
    deepEqual(presenter.oMap.test, handlers.test, 'data stored properly');

	ok(presenter.routeEvent, 'trigger exists');
	equal(typeof presenter.routeEvent, 'function', 'trigger is a function');
	equal(presenter.routeEvent.length, 1, 'trigger expects 1 arguments');

    presenter.routeEvent(mockEvent);
    equal(clicked, true, 'click event handler executed');

    presenter = new jMVP.Presenter(
        handlers, new jMVP.View(view), new jMVP.Model(model)
    );

    ok(presenter.oView, 'View is stored');
    ok(presenter.oModel, 'Model is stored');
    deepEqual(presenter.oView.constructor, jMVP.View, 'View object stored is jMVP.View instance');
    deepEqual(presenter.oModel.constructor, jMVP.Model, 'Model object stored is jMVP.Model instance');


});
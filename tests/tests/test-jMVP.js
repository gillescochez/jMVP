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

    ok(jMVP.error, 'jMVP.error exists');
    equal(typeof jMVP.error, 'function', 'jMVP.error is a function');
    equal(jMVP.error && jMVP.prototype.error === undefined, true, 'jMVP.error is static');
    equal(jMVP.error.length, 2, 'jMVP.error expect 2 arguments');

	/**
	 * jMVP Presenter object
	 */

	ok(jMVP.Presenter, 'jMVP.Presenter exists');
	equal(typeof jMVP.Presenter, 'function', 'jMVP.Presenter is a function');
	equal(jMVP.Presenter && jMVP.prototype.Presenter === undefined, true, 'jMVP.Presenter is static');
	equal(jMVP.Presenter.length, 3, 'jMVP.Presenter expect 3 arguments');

});
test('.each static method - functional', function() {

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

module('jMVP.dom');
test('dom helper / Wrap class - basic / functional', function() {

	var aMethods = 'each,addClass,removeClass,text,html,rmAttr,setAttr'.split(','),
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

//    deepEqual(jMVP.dom.createNode(), document.createElement('div'), 'default is a div');
//    deepEqual(jMVP.dom.createNode('span'), document.createElement('span'), 'createNode custom tag');

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

    // reset divDom before chain test as can affect test above
    divDom = jMVP.dom(document.createElement('div'));
	aMethods.forEach(function(sMethod) {
        if (sMethod == 'each') deepEqual(divDom[sMethod](function(){}), divDom, sMethod + ' chained');
        else deepEqual(divDom[sMethod]('a'), divDom, sMethod + ' chained');

	});

    ok(jMVP.dom.on, 'on exists');
    equal(typeof jMVP.dom.on, 'function', 'on is a function');
    equal(jMVP.dom.on.length, 3, 'on expects 2 arguments');

    ok(jMVP.dom.off, 'off exists');
    equal(typeof jMVP.dom.off, 'function', 'off is a function');
    equal(jMVP.dom.off.length, 3, 'off expects 3 arguments');

    // tests on/off are inherited (1 argument less)
    ok(divDom.on, 'on exists');
    equal(typeof divDom.on, 'function', 'on is a function');
    equal(divDom.on.length, 2, 'on expects 2 arguments');

    ok(divDom.off, 'off exists');
    equal(typeof divDom.off, 'function', 'off is a function');
    equal(divDom.off.length, 2, 'off expects 2 arguments');

    // display method
    divDom.display(false);
    equal(divDom.aNodes[0].style.display, 'none', 'display = none');
    divDom.display();
    equal(divDom.aNodes[0].style.display, '', 'display = block (no argument)');
    divDom.display(false);
    divDom.display(true);
    equal(divDom.aNodes[0].style.display, '', 'display = block');
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
				click: function(oEvent) {
                    deepEqual(oEvent, mockEvent, 'Event object returned');
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
		presenter = new jMVP.Presenter(handlers),
        oModel = new jMVP.Model(model),
        oView = new jMVP.View(view, true);

        /**
     * With Presenter config object only
     */

	ok(presenter.oMap, 'Map exists');
	ok(presenter.oMap.test, 'data stored in map');
    deepEqual(presenter.oMap, handlers, 'data stored properly');
    deepEqual(presenter.oMap.test, handlers.test, 'data stored properly');

    'getMap,getView,getModel,getConfig,isInMap,routeEvent,bindToView'.split(',').forEach(function(method) {
        ok(presenter[method], method + ' exists');
        equal(typeof presenter[method], 'function', method + ' is a function');
        if (method == 'isInMap' || method == 'routeEvent' || method == 'bindToView') {
            equal(presenter[method].length, 1, method + ' expects 1 argument');
        } else {
            equal(presenter[method].length, 0, method + ' expects 0 argument');
        }
    });

    presenter.routeEvent(mockEvent);
    equal(clicked, true, 'click event handler executed');

    /**
     * View jMVP.View and jMVP.Data
     * @type {jMVP.Presenter}
     */
    presenter = new jMVP.Presenter(
        handlers, oView, oModel
    );

    deepEqual(presenter.getMap(), presenter.oMap, 'getMap');
    deepEqual(presenter.getModel(), oModel, 'getModel');
    deepEqual(presenter.getView(), oView, 'getView');
    deepEqual(presenter.getConfig(), handlers, 'getView');

    ok(presenter.view, 'View is stored');
    ok(presenter.model, 'Model is stored');
    deepEqual(presenter.view.constructor, jMVP.View, 'View object stored is jMVP.View instance');
    deepEqual(presenter.model.constructor, jMVP.Model, 'Model object stored is jMVP.Model instance');
});

module('jMVP');
test('Instance - functional', function() {
    var presenter = {
            test: {
                click: function(oEvent, oModel, oView) {}
            }
        },
        view = {
            test: {
                hook:{
                    text: 'foo'
                }
            }
        },
        model = {
            foo: 'foo'
        },
        jmvp = new jMVP(model, view, presenter);

    ok(jmvp.oRawModel, 'oRawModel exists');
    ok(jmvp.oRawView, 'oRawView exists');
    ok(jmvp.oRawPresenter, 'oRawPresenter exists');

    ok(jmvp.model, 'model exists');
    ok(jmvp.view, 'view exists');
    ok(jmvp.presenter, 'presenter exists');

    deepEqual(jmvp.model.constructor, jMVP.Model, 'model instance of jMVP.Model');
    deepEqual(jmvp.view.constructor, jMVP.View, 'view instance of jMVP.View');
    deepEqual(jmvp.presenter.constructor, jMVP.Presenter, 'presenter instance of jMVP.Presenter');

    equal(jmvp.view.eDomView.innerHTML.toLowerCase(), '<div class="test">foo</div>', 'Setting new value on the model update the view');

    ok(jmvp.addModelListener, 'addModelListener exists');
    equal(typeof jmvp.addModelListener, 'function', 'addModelListener is a function');
    ok(jmvp.applyModelToView, 'applyModelToView exists');
    equal(typeof jmvp.applyModelToView, 'function', 'applyModelToView is a fucntion');

    // getter/setter for raw data
    'RawModel,RawView,RawPresenter,Model,View,Presenter'.split(',').forEach(function(sValue) {
        ok(jmvp['get' + sValue], sValue + ' exists');
        equal(typeof jmvp['get' + sValue], 'function', sValue + ' is a function');
    });

    deepEqual(jmvp.getRawModel(), model, 'getRawModel works');
    deepEqual(jmvp.getRawView(), view, 'getRawModel works');
    deepEqual(jmvp.getRawPresenter(), presenter, 'getRawModel works');

    deepEqual(jmvp.getModel(), jmvp.model, 'getModel works');
    deepEqual(jmvp.getView(), jmvp.view, 'getView works');
    deepEqual(jmvp.getPresenter(), jmvp.presenter, 'getPresenter works');

});
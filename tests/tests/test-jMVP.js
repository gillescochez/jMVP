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
	 * jMVP View object
	 */

	ok(jMVP.View, 'jMVP.View exists');
	equal(typeof jMVP.View, 'function', 'jMVP.View is a function');
	equal(jMVP.prototype.View, undefined, 'jMVP.View is static');
	equal(jMVP.View.length, 1, 'jMVP.View expect 1 argument');

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

module('jMVP.Model');
test('Model / Data instances - functional', function() {

	var oRawData = {
			foo: 'foo',
			boo:'boo',
            arr: ['a', 'b'],
            obj: {c:'d'}
		},
		oModel = new jMVP.Model(oRawData),
		oData = new jMVP.Data('a'),
		valueFromOnValueUpdated,
        valueFromOnModelUpdated = {};

    /**
     * jMVP.Data
     */
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
    equal(oData.getValue(), 'A', 'data updated returned properly');

    /**
     * jMVP.Model
     */
	equal(oModel.foo.getValue(), 'foo', 'getValue return right data');
	oModel.foo.setValue('FOO');
	equal(oRawData.foo, 'FOO', 'original data update');
	equal(oModel.foo.getValue(), 'FOO', 'getValue return updated data');

    ok(oModel.onModelUpdated, 'onModelUpdated exists');
    equal(typeof oModel.onModelUpdated, 'function', 'onModelUpdated is a function');

    oModel.onModelUpdated = function(sKey, vValue) {
        valueFromOnModelUpdated.key = sKey;
        valueFromOnModelUpdated.value = vValue;
    };
    oModel.foo.setValue('FOOO');
    equal(valueFromOnModelUpdated.key, 'foo', 'onModelUpdated return key');
    equal(valueFromOnModelUpdated.value, 'FOOO', 'onModelUpdated return updated value');
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
	ok(oView.oConfig, 'oRawView exists');
	deepEqual(oView.oConfig, oTmpl, 'oRawView === oTmpl');

	ok(oView.eDomView, 'eDomView exists');

    ok(oView.oMap, 'oMap exists');
    equal(typeof oView.oMap, 'object', 'oMap is an object');

    ok(oView.oLoopMap, 'oLoopMap exists');
    equal(typeof oView.oLoopMap, 'object', 'oLoopMap is an object');

    ok(oView.oNodesMap, 'oNodesMap exists');
    equal(typeof oView.oNodesMap, 'object', 'oNodesMap is an object');

    'getMap,getConfig,isInMap,getDOM,getElement,generate,mapLoop,mapHooks'
        .split(',').forEach(function(method) {

            ok(oView[method], method + ' exists');
            equal(typeof oView[method], 'function', method + ' is a function');
        });

    deepEqual(oView.getConfig(), oTmpl, '.getConfig() === oTmpl');
    deepEqual(oView.getMap(), oView.oMap, '.getMap() === oView.oMap');
    deepEqual(oView.getDOM(), oView.eDomView, '.getDOM() === oView.eDomView');
    equal(oView.isInMap('foo'), true, 'is in map');
    equal(oView.isInMap('aaa'), false, 'is not in map');
    deepEqual(oView.getElement('test'), oView.eDomView.querySelector('.test'), 'getElement gets');
    equal(oView.getElement('aaa'), null, 'getElement null');

	ok(oView.render, 'render exists');
	equal(typeof oView.render, 'function', 'render is a functgion');

	oView.render(div);

	equal(div.innerHTML.toLowerCase().replace(/[\n\r]/g, ''), '<div><div class="test"></div></div>', 'View rendered properly');

	ok(oView.update, 'update exists');
	equal(typeof oView.update, 'function', 'update is a function');
	equal(oView.update.length, 2, 'render expects 2 arguments');

	oView.update('foo', oModel.foo);

	equal(div.innerHTML.toLowerCase().replace(/[\n\r]/g, ''), '<div><div class="test">foo</div></div>', 'Basic hook test');
});
test('View hooks - functional', function() {

	ok(jMVP.View.hooks, 'jMVP.View.hooks exists');
	equal(typeof jMVP.View.hooks, 'object', 'jMVP.View.hooks is an object');
	equal(jMVP.View.prototype.hooks, undefined, 'jMVP.View.hooks is static');

	'text,html,attributes,classNames'.split(',').forEach(function(hook) {

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
                children: {
                    side: {},
                    main: {
                        children:{
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
                }
			}
		},
		oView = new jMVP.View(oTmpl),
		div = document.createElement('div'),
		updatedHtml = '<div><div class="header"></div><div class="content"><div class="side"></div><div class="main"><h1 class="title visible" title="test">test</h1><div class="article" title="test"><p>bla bla bla</p></div></div></div></div>',
		emptyHtml = '<div><div class="header"></div><div class="content"><div class="side"></div><div class="main"><h1 class="title"></h1><div class="article"></div></div></div></div>';

	oView.render(div);

	equal(div.innerHTML.toLowerCase().replace(/[\n\r]/g, ''), emptyHtml, 'Complex view markup');

	oView.update('pagetitle', oModel.pagetitle);
	oView.update('pagecontent', oModel.pagecontent);
	oView.update('hideTitle', oModel.hideTitle);

	equal(div.innerHTML.toLowerCase().replace(/[\n\r]/g, ''), updatedHtml, 'text and html hooks');
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
        oView = new jMVP.View(view);

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
                text: 'foo'
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
test('Complex view/model structure', function() {
   var model = {
           title: 'Titre',
           subtitle: 'Sous Titre',
           categories: ['action','adventure','sci-fi']
       },
       view = {
            article: {
                children: {
                    header: {
                        text: 'title'
                    },
                    subheader: {
                        text: 'subtitle'
                    },
                    genres: {
                        tag: 'ul',
                        loop: {
                            source: 'categories',
                            template: {
                                item: {
                                    tag: 'li',
                                    text: '$value',
                                    attributes: {
                                        title: '$value'
                                    }
                                }
                            }
                        }
                    }
                }
            }
       },
       presenter = {},
       jmvp = new jMVP(model, view, presenter);

    console.log(jmvp.getView().getDOM());
});
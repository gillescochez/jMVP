module('jMVP.View');
test('API', function() {

    var viewConfig = {
        test: {
            children: {
                foo: {
                    tag: 'span',
                    hook: {
                        text: 'foo'
                    }
                }
            }
        }
    };

    ok(jMVP.View, 'jMVP.View exists');
    equal(typeof jMVP.View, 'function', 'jMVP.View exists');
    equal(jMVP.View.length, 2, '2 arguments');

    /** replace error method to check
     * if it is called when view initialized without config object
     **/
    var jMVP_error = jMVP.error,
        errorExists = null;

    jMVP.error = function() {
        errorExists = true;
    };

    var viewInstance = new jMVP.View();
    equal(errorExists, true, 'Error if no config object');

    /** re-assign error method **/
    jMVP.error = jMVP_error;

    viewInstance = new jMVP.View(viewConfig);

    ok(viewInstance instanceof jMVP.View, 'jMVP.View instance');

    // config object
    ok(viewInstance.config, 'config obj exists');
    deepEqual(viewInstance.config, viewConfig, 'Configuration stored');
    ok(viewInstance.getConfig, 'viewInstance.getConfig exists');
    equal(typeof viewInstance.getConfig, 'function', 'viewInstance.getConfig exists');
    equal(viewInstance.getConfig.length, 0, '0 argument');
    deepEqual(viewInstance.getConfig(), viewConfig, 'viewInstance.getConfig() == raw config');
    deepEqual(viewInstance.getConfig(), viewInstance.config, 'viewInstance.getConfig() == stored prop');

    // maps and getters
    'nodeMap,refMap,loopMap'.split(',').forEach(function(mapName) {

        var getter = 'get' + mapName.substring(0, 1).toUpperCase() + mapName.substring(1, mapName.length);

        // property tests
        ok(viewInstance[mapName], mapName);
        deepEqual(viewInstance[mapName], {}, mapName + ' configuration stored');

        // getter  tests
        ok(viewInstance[getter], getter);
        equal(typeof viewInstance[getter], 'function', getter + ' is function');
        equal(viewInstance[getter].length, 0, '0 argument');
        deepEqual(viewInstance[getter](), {}, getter + ' == {}');
        deepEqual(viewInstance[getter](), viewInstance[mapName], getter + ' == stored prop');
    });

    // dom view
    ok(viewInstance.domView, 'domView exists');
    equal(viewInstance.domView.outerHTML, '<div></div>', 'domView is set');
    ok(viewInstance.getDomView, 'getDomView');
    equal(typeof viewInstance.getDomView, 'function', 'getDomView is function');
    equal(viewInstance.getDomView.length, 0, '0 argument');
    deepEqual(viewInstance.getDomView().outerHTML, '<div></div>', 'getDomView == {}');
    deepEqual(viewInstance.getDomView(), viewInstance.domView, 'getDomView == stored prop');

    // custom id/tag/className for dom view
    var simpleView = new jMVP.View({
        id: 'test',
        className: 'foo',
        tag: 'span'
    });
    deepEqual(simpleView.getDomView().outerHTML, '<span id="test" class="foo"></span>', 'getDomView == {}');

    // createNode method
    ok(viewInstance.createNode, 'viewInstance.createNode exists');
    equal(typeof viewInstance.createNode, 'function', 'viewInstance.createNode exists');
    equal(viewInstance.createNode.length, 2, '2 arguments');

    // storeNode method
    ok(viewInstance.storeNode, 'viewInstance.storeNode exists');
    equal(typeof viewInstance.storeNode, 'function', 'viewInstance.storeNode exists');
    equal(viewInstance.storeNode.length, 2, '2 arguments');

    var hook = 'text',
        value = 'foo',
        node = document.createElement('div');

    viewInstance.storeNode('node', node);
    deepEqual(viewInstance.getNodeMap()['node'], node, 'storeNode: node is stored');

    // getNode method
    ok(viewInstance.getNode, 'viewInstance.getNode exists');
    equal(typeof viewInstance.getNode, 'function', 'viewInstance.getNode exists');
    equal(viewInstance.getNode.length, 1, '1 argument');
    deepEqual(viewInstance.getNode('node'), node, 'getNode on existing node');
    equal(viewInstance.getNode('asda'), null, 'getNode on non-existing node');

    // storeHook
    ok(viewInstance.storeHook, 'viewInstance.storeHook exists');
    equal(typeof viewInstance.storeHook, 'function', 'viewInstance.storeHook exists');
    equal(viewInstance.storeHook.length, 3, '3 arguments');

    viewInstance.storeHook(node, hook, value);

    ok(viewInstance.getRefMap()[value], 'RefMap property created');
    ok(viewInstance.getRefMap()[value][hook], 'RefMap for the hook created');
    equal(viewInstance.getRefMap()[value][hook].constructor, Array, 'Map for the hook is an array');
    deepEqual(viewInstance.getRefMap()[value][hook][0], node, 'Node is stored');

    viewInstance.storeHook(node, 'attr', {
        title: 'attr1',
        rel: 'attr2'
    });

    hook = 'attr';

    'attr1,attr2'.split(',').forEach(function(sProp) {
        ok(viewInstance.getRefMap()[sProp], 'Map property created');
        ok(viewInstance.getRefMap()[sProp][hook], 'Map for the hook created');
        equal(viewInstance.getRefMap()[sProp][hook][sProp == 'attr1' ? 'title' : 'rel'].constructor, Array, 'Map for the hook is an array');
        deepEqual(viewInstance.getRefMap()[sProp][hook][sProp == 'attr1' ? 'title' : 'rel'][0], node, 'Node is stored');
    });

    // storeLoop
    ok(viewInstance.storeLoop, 'viewInstance.storeLoop exists');
    equal(typeof viewInstance.storeLoop, 'function', 'viewInstance.storeLoop exists');
    equal(viewInstance.storeLoop.length, 2, '2 arguments');

    var loop = {
        source: 'a',
        template: {
            test: {
                text: 'bla'
            }
        }
    };

    viewInstance.storeLoop(loop);
    deepEqual(viewInstance.getLoopMap()['a'][0], loop);

    // hook method
    ok(viewInstance.hook, 'viewInstance.hookItUp exists');
    equal(typeof viewInstance.hook, 'function', 'viewInstance.hookItUp exists');
    equal(viewInstance.hook.length, 2, '2 optional arguments');

    // reassign a new clean instance
    viewInstance = new jMVP.View(viewConfig);

    // parse method
    ok(viewInstance.parse, 'viewInstance.parse exists');
    equal(typeof viewInstance.parse, 'function', 'viewInstance.parse exists');
    equal(viewInstance.parse.length, 2, '2 optional arguments');

    viewInstance.parse();

    equal(viewInstance.domView.innerHTML, '<div class="test"><span class="foo"></span></div>', 'DOM generated');

    // apply hooks
    ok(viewInstance.applyHooks, 'viewInstance.applyHooks exists');
    equal(typeof viewInstance.applyHooks, 'function', 'viewInstance.applyHooks exists');
    equal(viewInstance.applyHooks.length, 2, '2 arguments');
    viewInstance.applyHooks('foo', 'a');
    equal(viewInstance.getNode('foo').innerHTML, 'a', 'apply Hooks');
    // reset
    viewInstance.applyHooks('foo', '');

    // update method
    ok(viewInstance.update, 'viewInstance.update exists');
    equal(typeof viewInstance.update, 'function', 'viewInstance.update exists');
    equal(viewInstance.update.length, 2, '2 arguments');

    viewInstance.update('foo', 'a');
    equal(viewInstance.getNode('foo').innerHTML, 'a', 'apply Hooks');

    viewInstance.update('foo', ['a', 'b']);
    equal(viewInstance.getNode('foo').innerHTML, 'a, b', 'apply Hooks');

});
test('Hooks', function() {

    ok(jMVP.View.hooks, 'jMVP.View.hooks exists');
    equal(typeof jMVP.View.hooks, 'object', 'jMVP.View.hooks is an object');
    equal(jMVP.View.prototype.hooks, undefined, 'jMVP.View.hooks is static');

    'text,html,attr,css,display'.split(',').forEach(function(hook) {

        ok(jMVP.View.hooks[hook], 'jMVP.View.hooks.' + hook + ' exists');
        equal(typeof jMVP.View.hooks[hook], 'function', 'jMVP.View.hooks.' + hook + ' is a function');
        if (hook == 'css' || hook == 'attr') {
            equal(jMVP.View.hooks[hook].length, 3, 'jMVP.View.hooks.' + hook + ' expects 3 arguments');
        } else {
            equal(jMVP.View.hooks[hook].length, 2, 'jMVP.View.hooks.' + hook + ' expects 2 arguments');
        }
    });
});
test('Loops', function() {

    var view = {
        list: {
            tag: 'ul',
            loop: {
                source: 'foo',
                template: {
                    item: {
                        tag:'li',
                        hook: {
                            text: 'foo'
                        }
                    }
                }
            }
        }
    };

    var viewInstance = new jMVP.View(view);
    viewInstance.parse();

    deepEqual(viewInstance.getLoopMap()['foo'][0], view.list.loop, 'Loop config stored');
    equal(viewInstance.getDomView().innerHTML, '<ul class="list"></ul>', 'Init: Loop template handled');

    ok(viewInstance.loop, '.loop exists');
    equal(typeof viewInstance.loop, 'function', '.loop is a function');
    equal(viewInstance.loop.length, 2, '.loop has 2 arguments');

    ok(viewInstance.doNodes, '.doNodes exists');
    equal(typeof viewInstance.doNodes, 'function', '.doNodes is a function');
    equal(viewInstance.doNodes.length, 3, '.doNodes has 2 argument');

    viewInstance.update('foo', ['a', 'b']);
    equal(viewInstance.getDomView().innerHTML, '<ul class="list"><li class="item">a</li><li class="item">b</li></ul>', 'Array: Loop content updated');

    // testing adding nodes
    viewInstance.update('foo', ['a', 'b', 'c']);
    equal(viewInstance.getDomView().innerHTML, '<ul class="list"><li class="item">a</li><li class="item">b</li><li class="item">c</li></ul>', 'Array: Loop content updated with more elements');

    // testing removing nodes
    viewInstance.update('foo', ['a', 'b']);
    equal(viewInstance.getDomView().innerHTML, '<ul class="list"><li class="item">a</li><li class="item">b</li></ul>', 'Array: Loop content updated with less elements');
});
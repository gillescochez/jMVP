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
    equal(jMVP.View.length, 1, '1 argument');

    /** replace error method to check
     * if it is called when view initialized without config object
     **/
    var jMVP_error = jMVP.error,
        errorExists = null;

    jMVP.error = function() {
        errorExists = true;
    };

    var oView = new jMVP.View();
    equal(errorExists, true, 'Error if no config object');

    /** re-assign error method **/
    jMVP.error = jMVP_error;

    oView = new jMVP.View(viewConfig);

    ok(oView instanceof jMVP.View, 'jMVP.View instance');

    // config object
    ok(oView.oConfig, 'config obj exists');
    deepEqual(oView.oConfig, viewConfig, 'Configuration stored');
    ok(oView.getConfig, 'oView.getConfig exists');
    equal(typeof oView.getConfig, 'function', 'oView.getConfig exists');
    equal(oView.getConfig.length, 0, '0 argument');
    deepEqual(oView.getConfig(), viewConfig, 'oView.getConfig() == raw config');
    deepEqual(oView.getConfig(), oView.oConfig, 'oView.getConfig() == stored prop');

    // maps and getters
    'oNodeMap,oRefMap,oLoopMap'.split(',').forEach(function(sMapName) {

        var sGetter = 'get' + sMapName.substring(1, sMapName.length);

        // property tests
        ok(oView[sMapName], sMapName);
        deepEqual(oView[sMapName], {}, sMapName + ' configuration stored');

        // getter  tests
        ok(oView[sGetter], sGetter);
        equal(typeof oView[sGetter], 'function', sGetter + ' is function');
        equal(oView[sGetter].length, 0, '0 argument');
        deepEqual(oView[sGetter](), {}, sGetter + ' == {}');
        deepEqual(oView[sGetter](), oView[sMapName], sGetter + ' == stored prop');
    });

    // dom view
    ok(oView.eDomView, 'eDomView exists');
    equal(oView.eDomView.outerHTML, '<div></div>', 'eDomView is set');
    ok(oView.getDomView, 'getDomView');
    equal(typeof oView.getDomView, 'function', 'getDomView is function');
    equal(oView.getDomView.length, 0, '0 argument');
    deepEqual(oView.getDomView().outerHTML, '<div></div>', 'getDomView == {}');
    deepEqual(oView.getDomView(), oView.eDomView, 'getDomView == stored prop');

    // createNode method
    ok(oView.createNode, 'oView.createNode exists');
    equal(typeof oView.createNode, 'function', 'oView.createNode exists');
    equal(oView.createNode.length, 2, '2 arguments');

    // storeNode method
    ok(oView.storeNode, 'oView.storeNode exists');
    equal(typeof oView.storeNode, 'function', 'oView.storeNode exists');
    equal(oView.storeNode.length, 2, '2 arguments');

    var sHook = 'text',
        vValue = 'foo',
        node = document.createElement('div');

    oView.storeNode('node', node);
    deepEqual(oView.getNodeMap()['node'], node, 'storeNode: node is stored');

    // getNode method
    ok(oView.getNode, 'oView.getNode exists');
    equal(typeof oView.getNode, 'function', 'oView.getNode exists');
    equal(oView.getNode.length, 1, '1 argument');
    deepEqual(oView.getNode('node'), node, 'getNode on existing node');
    equal(oView.getNode('asda'), null, 'getNode on non-existing node');

    // storeHook
    ok(oView.storeHook, 'oView.storeHook exists');
    equal(typeof oView.storeHook, 'function', 'oView.storeHook exists');
    equal(oView.storeHook.length, 3, '3 arguments');

    oView.storeHook(node, sHook, vValue);

    ok(oView.getRefMap()[vValue], 'RefMap property created');
    ok(oView.getRefMap()[vValue][sHook], 'RefMap for the hook created');
    equal(oView.getRefMap()[vValue][sHook].constructor, Array, 'Map for the hook is an array');
    deepEqual(oView.getRefMap()[vValue][sHook][0], node, 'Node is stored');

    oView.storeHook(node, 'attr', {
        title: 'attr1',
        rel: 'attr2'
    });

    sHook = 'attr';

    'attr1,attr2'.split(',').forEach(function(sProp) {
        ok(oView.getRefMap()[sProp], 'Map property created');
        ok(oView.getRefMap()[sProp][sHook], 'Map for the hook created');
        equal(oView.getRefMap()[sProp][sHook][sProp == 'attr1' ? 'title' : 'rel'].constructor, Array, 'Map for the hook is an array');
        deepEqual(oView.getRefMap()[sProp][sHook][sProp == 'attr1' ? 'title' : 'rel'][0], node, 'Node is stored');
    });

    // storeLoop
    ok(oView.storeLoop, 'oView.storeLoop exists');
    equal(typeof oView.storeLoop, 'function', 'oView.storeLoop exists');
    equal(oView.storeLoop.length, 1, '1 argument');

    var loop = {
        source: 'a',
        template: {
            test: {
                text: 'bla'
            }
        }
    };

    oView.storeLoop(loop);
    deepEqual(oView.getLoopMap()['a'][0], loop);

    // hook method
    ok(oView.hook, 'oView.hookItUp exists');
    equal(typeof oView.hook, 'function', 'oView.hookItUp exists');
    equal(oView.hook.length, 2, '2 optional arguments');

    // reassign a new clean instance
    oView = new jMVP.View(viewConfig);

    // parse method
    ok(oView.parse, 'oView.parse exists');
    equal(typeof oView.parse, 'function', 'oView.parse exists');
    equal(oView.parse.length, 2, '2 optional arguments');

    oView.parse();

    equal(oView.eDomView.innerHTML, '<div class="test"><span class="foo"></span></div>', 'DOM generated');

    // apply hooks
    ok(oView.applyHooks, 'oView.applyHooks exists');
    equal(typeof oView.applyHooks, 'function', 'oView.applyHooks exists');
    equal(oView.applyHooks.length, 2, '2 arguments');
    oView.applyHooks('foo', 'a');
    equal(oView.getNode('foo').innerHTML, 'a', 'apply Hooks');
    // reset
    oView.applyHooks('foo', '');

    // update method
    ok(oView.update, 'oView.update exists');
    equal(typeof oView.update, 'function', 'oView.update exists');
    equal(oView.update.length, 2, '2 arguments');

    oView.update('foo', 'a');
    equal(oView.getNode('foo').innerHTML, 'a', 'apply Hooks');

    oView.update('foo', {a:'b', c:'d'});
    equal(oView.getNode('foo').innerHTML, 'a: b, c: d', 'apply Hooks');

    oView.update('foo', ['a', 'b']);
    equal(oView.getNode('foo').innerHTML, 'a, b', 'apply Hooks');

});
test('Hooks - functional', function() {

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
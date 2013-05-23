module('jMVP.View');
test('API', function() {

    var viewConfig = {
        test: {}
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

    ok(oView.eDomView, 'eDomView exists');
    equal(oView.eDomView.outerHTML, '<div></div>', 'eDomView is set');

    // parse method
    ok(oView.parse, 'oView.parse exists');
    equal(typeof oView.parse, 'function', 'oView.parse exists');
    equal(oView.parse.length, 1, '1 optional argument');

    // createNode method
    ok(oView.createNode, 'oView.createNode exists');
    equal(typeof oView.createNode, 'function', 'oView.createNode exists');
    equal(oView.createNode.length, 2, '2 arguments');

    oView.createNode('a', 'span');
    ok(oView.getNodeMap()['a'], 'New element stored');
    deepEqual(oView.getNodeMap()['a'][0].outerHTML, '<span class="a"></span>', 'element created using custom tag');

    oView.createNode('b');
    ok(oView.getNodeMap()['b'], 'New element stored');
    deepEqual(oView.getNodeMap()['b'][0].outerHTML, '<div class="b"></div>', 'element created using default tag');

    // storeNode method
    ok(oView.storeNode, 'oView.storeNode exists');
    equal(typeof oView.storeNode, 'function', 'oView.storeNode exists');
    equal(oView.storeNode.length, 2, '2 arguments');

    var node = document.createElement('div');
    oView.storeNode('node', node);
    deepEqual(oView.getNodeMap()['node'][0], node, 'storeNode: node is stored');
});
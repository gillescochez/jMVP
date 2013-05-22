module('jMVP.View');
test('API', function() {

    var viewConfig = {
        test: {}
    };

    ok(jMVP.View, 'jMVP.View exists');
    equal(typeof jMVP.View, 'function', 'jMVP.View exists');
    equal(jMVP.View.length, 1, '1 argument');

    var oView = new jMVP.View(viewConfig);

    ok(oView instanceof jMVP.View, 'jMVP.View instance');

    // config object
    ok(oView.oConfig, 'config obj exists');
    deepEqual(oView.oConfig, viewConfig, 'Configuration stored');
    ok(oView.getConfig, 'oView.getConfig exists');
    equal(typeof oView.getConfig, 'function', 'oView.getConfig exists');
    equal(oView.getConfig.length, 0, '0 argument');
    deepEqual(oView.getConfig(), viewConfig, 'oView.getConfig() == raw config');
    deepEqual(oView.getConfig(), oView.oConfig, 'oView.getConfig() == stored prop');

    // map objects
    'oNodeMap,oRefMap,oLoopMap'.split(',').forEach(function(sMapName) {
        var sGetter = 'get' + sMapName.substring(1, sMapName.length);
        ok(oView[sMapName], sMapName);
        deepEqual(oView[sMapName], {}, sMapName + ' configuration stored');
        ok(oView[sGetter], sGetter);
        equal(typeof oView[sGetter], 'function', sGetter + ' is function');
        equal(oView[sGetter].length, 0, '0 argument');
        deepEqual(oView[sGetter](), {}, sGetter + ' == {}');
        deepEqual(oView[sGetter](), oView[sMapName], sGetter + ' == stored prop');
    });

    // parse method
    ok(oView.parse, 'oView.parse exists');
    equal(typeof oView.parse, 'function', 'oView.parse exists');
    equal(oView.parse.length, 1, '1 optional argument');

});
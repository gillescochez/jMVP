module("jMVP.Model");
test('Data API', function() {

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


});
test('Model API', function() {

    var model = {
            sitetitle: 'jMVP site',
            pagetitle: 'Hello World!',
            pagecontent: '<p>Welcome to a jMVP powered website</p>',
            items: ['option1', 'option2', 'option3'],
            isBig: true,
            isRed: true
        },
        oModel = new jMVP.Model(model),
        key;

    for (key in model) {
        ok(oModel[key], key + ' exists');
        equal(typeof oModel[key], 'function', key + ' is a function');
        equal(oModel[key].length, 1, key + ' has 1 optional argument');
        equal(oModel[key](), model[key], key + ' has default value');
        oModel[key]('foo');
        equal(oModel[key](), model[key], key + ' has updated value');
    }

});
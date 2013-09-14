module("jMVP.Model");
test('Data API', function() {

    var rawData = {
            foo: 'foo',
            boo:'boo',
            arr: ['a', 'b'],
            obj: {c:'d'}
        },
        data = new jMVP.Data('a'),
        valueFromOnValueUpdated;

    /**
     * jMVP.Data
     */
    ok(data.value, 'value property');
    equal(data.value, 'a', 'value is correct');

    ok(data.getValue, 'data getter exists');
    ok(data.setValue, 'data setter exists');
    ok(data.onValueUpdated, 'data onValueUpdated callback exists');
    equal(typeof data.getValue, 'function', 'getter is function');
    equal(typeof data.setValue, 'function', 'setter is function');
    equal(typeof data.onValueUpdated, 'function', 'onValueUpdated callback is function');
    data.onValueUpdated = function(value) {
        valueFromOnValueUpdated = value;
    };
    data.setValue('A');
    equal(valueFromOnValueUpdated, 'A', 'onValueUpdated return updated data');
    equal(data.getValue(), 'A', 'data updated returned properly');


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
        modelInstance = new jMVP.Model(model),
        key;

    for (key in model) {
        ok(modelInstance[key], key + ' exists');
        equal(typeof modelInstance[key], 'function', key + ' is a function');
        equal(modelInstance[key].length, 1, key + ' has 1 optional argument');
        equal(modelInstance[key](), model[key], key + ' has default value');
        modelInstance[key]('foo');
        equal(modelInstance[key](), model[key], key + ' has updated value');
    }

});
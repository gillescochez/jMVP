module("jMVP.Model");
test('new API', function() {

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
var model = {
	foo: 'test'
};

var view = new jMVP.View();
view.template('<div>{{$foo}}</div>');

var presenter = new jMVP.Presenter({
	onFooClick: function() {

	}
});

var jmvp = new jMVP(model, view, presenter);

jmvp.model.foo.setValue('TEST');
jmvp.view.template('<span>{{$foo}}</span>');


// load files and return a jMVP instance ready to use
jMVP.import('model', 'view', 'presenter', function(jmvp) {

});


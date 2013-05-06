var model = {
	foo: 'test'
};

var view = new jMVP.View();

// TODO implement API and functionality
view.template('<div>{{$foo}}</div>');

// TODO implement functionality
var presenter = new jMVP.Presenter({

	onFooClick: function() {

	}
});

// TODO  implement functionality
var jmvp = new jMVP(model, view, presenter);


// TODO implement API and functionality
jmvp.model.foo.setValue('TEST');
jmvp.view.template('<span>{{$foo}}</span>');


// TODO implement functionality
jMVP.import('model-file', 'view-file', 'presenter-file', function(jmvp) {

});
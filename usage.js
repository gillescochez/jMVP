var model = {
	foo: 'test'
};

var view = new jMVP.View();
view.template('<div>{{$foo}}</div>');

var presenter = new jMVP.Presenter();

var mvp = new jMVP(model, view, presenter);

mvp.model.foo.setValue('TEST');
mvp.view.template('<span>{{$foo}}</span>');


var model = {
	foo: 'test'
};

var view = new jMVP.View().template('<div>{{$foo}}</div>');

var mvp = new jMVP(model, view);

mvp.model.foo.setValue('TEST');
mvp.view.template('<span>{{$foo}}</span>');


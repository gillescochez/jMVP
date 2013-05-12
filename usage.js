// Data only model
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
	isBig: true,
	isRed: true
};

// view as an object, no html to bundle!
var view = {
	header: {
		logo: {
			text: 'sitetitle'
		},
		search: {
			tag: 'input',
			attributes: {
				type: 'search'
			}
		}
	},
	page: {
		title: {
			tag: 'h1',
			text: 'pagetitle',
			classNames: {
				red: 'isRed',
				big: 'isBig'
			}
		},
		content: {
			html: 'pagecontent'
		}
	}
};

// presenter static object (performance!) to handle event from the view
var presenter = {

	title: {
		click: function(oDOMEvent, oModel, oView) {
			oModel.isRed.setValue(!oModel.isRed.getValue());
		},
		mouseover: function(oDOMEvent, oModel, oView) {}
	}
};

// mix it all together
var jmvp = jMVP(model, view, presenter);

// render to the document
jmvp.render(document.body);

// let's update our model (view is updated automatically)
jmvp.model.sitetitle.setValue('New site title');
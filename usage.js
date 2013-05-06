var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
	isBig: true,
	isRed: true
};

var view = {
	header: {
		logo:{},
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

var presenter = {

	onTitleClick: function(oDOMEvent, oModel, oView) {
		// should toggle red class on h1 attribute
		oModel.isRed.setValue(!oModel.isRed.getValue());
	}
};


var jmvp = jMVP(model, view, presenter);

jmvp.render(document.body);
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
	isBig: true,
	isRed: true
};

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

var presenter = {

	title: {
		click: function(oDOMEvent, oModel, oView) {
			oModel.isRed.setValue(!oModel.isRed.getValue());
		},
		mouseover: function(oDOMEvent, oModel, oView) {}
	}
};


var jmvp = jMVP(model, view, presenter);

jmvp.render(document.body);
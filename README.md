jMVP
====

Javascript Model View Presenter

## Usage aimed for (atm)

```javascript

// Data ONLY model
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
	isBig: true,
	isRed: true
};

// view as an object, NO HTML to bundle!
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

// presenter to handle DOM events
var presenter = {

	title: {
		click: function(oDOMEvent, oModel, oView) {
            console.log(arguments);
			oModel.isRed.setValue(!oModel.isRed.getValue());
		}
	}
};

// mix it all together
var jmvp = new jMVP(model, view, presenter);

// render to the document
jmvp.view.render(document.body);

// let's update our model (view is updated automatically)
jmvp.model.sitetitle.setValue('New site title');
jmvp.model.pagetitle.setValue('Page title');


```

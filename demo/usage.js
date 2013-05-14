// Data ONLY model
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
    demoObject: {
      foo:'FOO'
    },
    items: ['a','b','c'],
    isBig: true,
	isRed: true
};

// partial template made easy =)
var viewHeader = {
    logo: {
        text: 'sitetitle'
    },
    search: {
        tag: 'input',
        attributes: {
            value: 'pagetitle',
            type: 'search'
        }
    }
};

// view as an object, NO HTML to bundle!
var view = {
	header: viewHeader, // partial template =)
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

// New format on partial view, handles looping too
var list = {
    tag: 'ul',
    jmvp: {
        form: {
            name: 'contact'
        },
        loop: {
            data: 'model.items',
            template: {
                item: {
                    tag: 'li',
                    label: {
                        text: '$value'
                    }
                }
            }
        }
    }
};

// presenter to handle DOM events
var presenter = {

	title: {
		click: function(oDOMEvent, oModel) {
			oModel.isRed.setValue(!oModel.isRed.getValue());
		}
	},

    search: {
        blur: updatePageTitle,
        keyup: updatePageTitle
    }
};

function updatePageTitle(oDOMEvent, oModel) {
    var sValue = oDOMEvent.target.value;
    if (oModel.pagetitle.getValue() != sValue) {
        oModel.pagetitle.setValue(sValue);
    }
};

// mix it all together
var jmvp = new jMVP(model, view, presenter);

// render to the document
jmvp.view.render(document.body);

// let's update our model (view is updated automatically)
jmvp.model.sitetitle.setValue('New site title');
jmvp.model.pagetitle.setValue('Page title');
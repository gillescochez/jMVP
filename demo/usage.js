// Data ONLY model
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered website</p>',
    items: ['option1','option2','option3'],
    isBig: true,
	isRed: true
};

// partial template made easy =)
var viewHeader = {
    children: {
        logo: {
            hook: {
                text: 'sitetitle'
            }
        },
        liveEdit: {
            tag: 'input',
            hook: {
                attr: {
                    value: 'pagetitle',
                    type: 'search'
                }
            }
        }
//        select: {
//            tag: 'select',
//            loop: {
//                source: 'items',
//                template: {
//                    item: {
//                        tag: 'option',
//                        text: 'items'
//                    }
//                }
//            }
//        }
    }
};

// view as an object, NO HTML to bundle!
var view = {
	header: viewHeader, // partial template =)
	page: {
        children: {
            title: {
                tag: 'h1',
                hook: {
                    css: {
                        red: 'isRed',
                        big: 'isBig'
                    },
                    text: 'pagetitle'
                }
            },
            content: {
                hook: {
                    html: 'pagecontent'
                }
            }
        }
	}
};

// presenter to handle DOM events
var presenter = {

	title: {
		click: function(oDOMEvent, oModel) {
            oModel.isRed(!oModel.isRed());
		}
	},

    liveEdit: {
        blur: updatePageTitle,
        keyup: updatePageTitle
    }
};

function updatePageTitle(oDOMEvent, oModel) {
    var sValue = oDOMEvent.target.value;
    if (oModel.pagetitle() != sValue) {
        oModel.pagetitle(sValue);
    }
}

// mix it all together
var jmvp = new jMVP(model, view, presenter);

// render to the document
jmvp.view.render(document.body);

// let's update our model (view is updated automatically)
jmvp.model.sitetitle('New site title');
jmvp.model.pagetitle('Page title');
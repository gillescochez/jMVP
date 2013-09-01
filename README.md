jMVP
====

Experimental Javascript MVP framework for creating app without HTML templates.

It has limitations and needs more work, just something I play with here and there and went over the top from a UTs POV :p

## JS Source of the demo

```javascript

// Data ONLY model
var model = {
	sitetitle: 'jMVP site',
	pagetitle: 'Hello World!',
	pagecontent: '<p>Welcome to a jMVP powered app</p>',
    items: ['option1','option2','option3'],
    isBig: true,
	isRed: true
};

// partial template made easy =)
var viewHeader = {
    children: {
        logo: {
            text: 'sitetitle'
        },
        liveEdit: {
            tag: 'input',
            attributes: {
                value: 'pagetitle',
                type: 'search'
            }
        },
        select: {
            tag: 'select',
            loop: {
                source: 'items',
                template: {
                    item: {
                        tag: 'option',
                        text: 'items'
                    }
                }
            }
        }
    }
};

// view as an object, NO HTML to bundle!
var view = {
	header: viewHeader, // partial template =)
	page: {
        children: {
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

```

## You still need some html for the app of course...

From the demo index.html

```html

<!DOCTYPE html>
<title>jMVP - demo</title>
<style>
	.red {
		color:red;
	}
</style>
<script src="../build/jMVP.src.js"></script>
<body>
<script src="usage.js"></script>
</body>
</html>

```

## The rendered result

```html

<div>
    <div class="header">
        <div class="logo">New site title</div>
        <input class="liveEdit" value="Page title...">
        <select class="select">
            <option class="item">option1</option>
            <option class="item">option2</option>
            <option class="item">option3</option>
        </select>
    </div>
    <div class="page">
        <h1 class="title big red">Page title...</h1>
        <div class="content"><p>Welcome to a jMVP powered app</p></div>
    </div>
</div>

```
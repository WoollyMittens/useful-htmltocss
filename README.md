# htmltocss.js: HTML to CSS Converter

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

This converter parses the structure of any given piece of HTML and generates a rough empty stylesheet from it.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/htmltocss.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="js/htmltocss.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'js/htmltocss.js'
], function(HtmltoCss) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {HtmltoCss} from "js/htmltocss.js');
```

## How to run the script

```javascript
var htmltocss = new HtmltoCss({
	'element' : document.getElementById('html2scss_form'),
	'htmlInput': document.querySelector('[name=html_input]'),
	'scssOutput': document.querySelector('[name=scss_output]'),
	'scssFormat': document.querySelector('[name=scss_format]'),
	'reverseClassNames': document.querySelector('[name=reverse_class_names]'),
	'splitClassNames': document.querySelector('[name=split_class_names]'),
	'undeepClassNames': document.querySelector('[name=undeep_class_names]'),
	'resetIds': document.querySelector('[name=reset_ids]'),
	'ignoreIds': document.querySelector('[name=ignore_ids]'),
	'convertHtml': document.querySelector('[name=convert_html]'),
	'indentation': document.querySelector('[name=indentation]'),
	'ignoreClasses': document.querySelector('[name=ignore_classes]')
});
```

**element : {DOM Element}** - The form element of the converter.

**... : {DOM Element}** - The individual formatting options.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).

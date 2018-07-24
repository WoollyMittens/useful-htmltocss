# htmltocss.js: HTML to CSS Converter

This converter parses the structure of any given piece of HTML and generates a rough empty stylesheet from it.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-htmltocss">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/htmltocss.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/htmltocss.js"></script>
```

## How to run the script

```javascript
var htmltocss = new Htmltocss({
	'element' : document.getElementById('htmltocss')
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**parent : {DOM node}** - The DOM element around which the functionality is centred.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/

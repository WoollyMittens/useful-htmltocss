/*
	Source:
	van Creij, Maurice (2018). ".htmltocss.js: Generates an empty stylesheet from HTML.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var HtmltoCss = function (cfg) {

	// PROPERTIES

	this.cfg = cfg;
	this.container = null;
	this.map = null;
	this.scss = null;
	this.ignore = null;

	// METHODS

	this.convert = function(submit, evt) {
		if (!submit) evt.preventDefault();
		// reset the state
		this.reset();
		// place the HTML in a DOM object
		this.container.innerHTML = cfg.htmlInput.value;
		// import the HTML DOM
		this.import(this.container, this.map);
		// export the result
		cfg.scssOutput.value = (cfg.scssFormat.checked) ?
			this.exportScss(this.scss, this.map.body, 0, ''):
			this.exportCss(this.scss, this.map.body, 0, '');
	};

	this.reset = function() {
		// set the starting values
		this.container = document.createElement('body');
		this.map = {};
		this.scss = null;
		this.ignore = new RegExp(cfg.ignoreClasses.value);
	};

	this.import = function(element, node) {
		// give the element a place in the map object
		if (!/text|script|comment/i.test(element.nodeName)) {
			var a, b;
			var key = element.nodeName.toLowerCase();
			var id = element.getAttribute('id');
			var classNames = (element.getAttribute('class')) ? element.getAttribute('class').trim().replace(/  /g, ' ').split(' ') : [];
			var classes = [];
			var ignore = this.ignore;
			var _container = this.container;
			classNames.map(function(name, index) {
				if (!ignore.test(name)) classes.push({
					'name': name,
					'index': index,
					'count' : _container.querySelectorAll('.' + name).length
				});
			});
			// add the input [type] if possible
			if (element.getAttribute('type')) key += '[type=' + element.getAttribute('type') + ']';
			// sort the classes by commonality
			classes = this.sortByCommonality(classes);
			// reverse the order of class name keys
			if (cfg.reverseClassNames.checked) classes = classes.reverse();
			// if the element has an ID
			if (id && !cfg.ignoreIds.checked) {
				// use the ID as a key
				key = '#' + id;
				// revert to the root of the map
				if (cfg.resetIds.checked && !/input|select|textarea/i.test(element.nodeName)) node = this.map.body;
				// else if the element has a class name
			} else if (classes.length > 0) {
				// use the first class as the key
				key = '.' + classes[0].name;
				// remove the first class
				classes = classes.reverse();
				classes.length = classes.length - 1;
				classes = classes.reverse();
			}
			// add a new node if needed
			node[key] = node[key] || {};
			// for any (remaining) class names
			classes.map(function(_class) {
				node[key]['&.' + _class.name] = {};
			});
			// add a :hover to links
			if (/^a$/i.test(element.nodeName)) node[key]['&:hover'] = {};
			// recurse all child nodes
			for (a = 0, b = element.childNodes.length; a < b; a += 1) {
				this.import(element.childNodes[a], node[key]);
			}
		}
	};

	this.sortByCommonality = function(classes) {
		classes.sort(function (a, b) {
			var aValue = a.count * 1000 - a.index;
			var bValue = b.count * 1000 - b.index;
			return (aValue < bValue) ? 1 : -1;
		});
		return classes;
	};

	this.exportScss = function(key, node, indent, scss) {
		// set up the indentation
		var tabs = '';
		for (var a = 1, b = indent; a < b; a += 1) {
			tabs += cfg.indentation.value.replace(/\\t/g, '\t');
		}
		// represent this node in the css
		scss += (key) ? tabs + key + ' {' : '';
		// only have an open bracket if there are child nodes
		if (key && Object.keys(node).length > 0) {
			scss += '\n';
		} else {
			tabs = '';
		}
		// recurse every key in this node
		for (var child in node) {
			scss += this.exportScss(child, node[child], indent + 1, '');
		}
		// close the node
		scss += (key) ? tabs + '}\n' : '';
		// return the result
		return scss;
	};

	this.exportCss = function(key, node, indent, scss) {
		// represent this node in the css
		scss += (key) ? key + ' {}\n' : '';
		// only have an open bracket if there are child nodes
		if (key && Object.keys(node).length > 0) {

		}
		// recurse every key in this node
		var rule = '';
		for (var child in node) {
			rule = (key) ? key + ' ' + child : child;
			rule = rule.replace(/ &/, '');
			scss += this.exportCss(rule, node[child], indent + 1, '');
		}
		// return the result
		return scss;
	};

	// EVENTS

	cfg.element.addEventListener('submit', this.convert.bind(this, false));
	cfg.htmlInput.addEventListener('change', this.convert.bind(this, true));
	cfg.scssFormat.addEventListener('change', this.convert.bind(this, true));
	cfg.reverseClassNames.addEventListener('change', this.convert.bind(this, true));
	cfg.resetIds.addEventListener('change', this.convert.bind(this, true));
	cfg.resetIds.addEventListener('change', this.convert.bind(this, true));
	cfg.ignoreIds.addEventListener('change', this.convert.bind(this, true));
	cfg.indentation.addEventListener('change', this.convert.bind(this, true));
	cfg.ignoreClasses.addEventListener('change', this.convert.bind(this, true));
	this.convert(true);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = HtmltoCss;
}

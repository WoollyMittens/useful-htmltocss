/*
	Source:
	van Creij, Maurice (2018). ".htmltocss.js: Generates an empty stylesheet from HTML.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Htmltocss = function (config) {

	// PROPERTIES

	this.isBootstrap = /span-\d|col-offset-..-\d|col-..-\d|mt-\d|mr-\d|mb-\d|ml-\d|pt-\d|pr-\d|pb-\d|pl-\d|row|container|pull-|first|last/;

	// METHODS

	this.init = function (config) {
		// store the configuration
		this.config = config;
		this.element = config.element;
		// set the form submit handler
		this.onFormSubmit(this.element);
		// gather the text areas
		var textareas = this.element.getElementsByTagName('textarea');
		this.config.input = textareas[0];
		this.config.output = textareas[1];
		this.onInputChange(this.config.input);
		// gather the options
		var options = this.element.getElementsByTagName('input');
		this.config.options = {};
		this.config.values = {};
		for (var a = 0, b = options.length; a < b; a += 1) {
			// if this is an actual option
			if (/checkbox|text/.test(options[a].type)) {
				// note its state
				this.config.options[options[a].name] = options[a].checked;
				this.config.values[options[a].name] = options[a].value;
				// add an event handler
				this.onOptionChange(options[a]);
			}
		}
		// initial state
		this.update();
		// return the object
		return this;
	};

	this.update = function () {
		// variables
		var dummy, output;
		// create a new dummy container
		dummy = document.createElement('div');
		// put the html from the input in the dummy container
		dummy.innerHTML = this.config.input.value;
		// pass the dummy through the redraw function
		output = this.parse(dummy, -1, '', '');
		// add the scss conversion step is needed
		if (this.config.options.compass) {
			output = this.convert(output);
		}
		//publish the result in the output
		this.config.output.value = output;
		// clear the  dummy container
		dummy = null;
	};

	this.childnodes = function (parent) {
		// variables
		var children, a, b, nodes = parent.childNodes;
		// for all nodes in the parent
		children = [];
		for (a = 0 , b = nodes.length; a < b; a += 1) {
			// if the node is not text
			if (!nodes[a].nodeName.match('#')) {
				// include it in the list of children
				children.push(nodes[a]);
			}
		}
		return children;
	};

	this.convert = function (output) {
		// split the output into lines
		var a, b, c, d, elements, tabs, next, lines = output.split('}');
		// for all lines
		for (a = 0 , b = lines.length - 1; a < b; a += 1) {
			// split the elements of each line
			elements = lines[a].split(' ');
			// restore the tabs
			tabs = elements[0].match(/\t/gi);
			tabs = (!tabs) ? [] : tabs;
			// only keep the last element of each line
			lines[a] = tabs.join('') + elements[elements.length - 2] + ' {\n';
			// if the next line exists
			if (a < lines.length) {
				// check the tabs on the next line
				next = lines[a + 1].match(/\t/gi);
				next = (!next) ? [] : next;
				// if the next line is shallower
				if (next.length < tabs.length) {
					// add the closing bracket at the end of the line
					lines[a] = lines[a].replace('{', '{}');
					// add closing bracket at the recursion down to the next indentation
					for (c = 0 , d = tabs.length - next.length; c < d; c += 1) {
						lines[a] += tabs.join('').substr(c + 1) + '}\n';
					}
				}
				// if the next line is at the same level
				if (next.length === tabs.length) {
					// add the closing bracket at the end of the line
					lines[a] = lines[a].replace('{', '{}');
				}
			}
		}
		// return the result
		return lines.join('');
	};

	this.parse = function (element, recursion, prefix, css) {
		var _this = this;
		// variables
		var a, b, indentation = '', entry = '', suffix = '', classNames = [], children = _this.childnodes(element);
		var hasId = (element.id),
			hasClass = (element.className),
			isAbridged = _this.config.options.abridged,
			noIds = _this.config.options.noids,
			isForm = /input/i.test(element.nodeName),
			isComplex = _this.config.options.complex,
			isReversed = _this.config.options.reverse,
			applyFilter = _this.config.options.applyfilter,
			filterReg = new RegExp(_this.config.values.filterreg, 'gi'),
			classSegments = element.className.trim().split(' ');
		// if the recursion is high enough
		if (recursion >= 0) {
			// if this recursion is only bootstrap markup
			if (applyFilter && !hasId && filterReg.test(element.className) && element.className.match(filterReg).length === classSegments.length) {
				// ignore this entire recursion
				recursion -= 1;
			} else {
				// add indentations based on the recursion
				indentation = '';
				if (_this.config.options.indented || _this.config.options.compass) {
					for (a = 0; a < recursion; a += 1) {
						indentation += '\t';
					}
				}
				// add the nodename
				entry = (isAbridged && ((hasId && !noIds) || hasClass)) ? '' : element.nodeName.toLowerCase();
				// add the form element type
				if (isForm && entry !== '') {
					entry += '[type=' + element.type + ']';
				}
				// add the id
				if (hasId && !noIds) {
					entry += '#' + element.id;
				}
				// filter out unwanted classes
				if (hasClass && applyFilter) {
					for (a = classSegments.length, b = 0; a > b; a -= 1) {
						if (classSegments[a - 1].match(filterReg)) {
							classSegments.splice(a - 1, 1);
						}
					}
					hasClass = (classSegments.length > 0);
				}
				// add the class names
				if (hasClass) {
					classNames = (isComplex) ? classSegments.sort(function (a, b) {var a = (a.match(/-/g) || []).length, b = (b.match(/-/g) || []).length; return b - a }) : classSegments;
					classNames = (isReversed) ? classSegments.reverse() : classSegments;
					entry += (_this.config.options.abridged) ? '.' + classNames[0] : '.' + classNames.join('.');
				}
				// if the line is still empty use the element type instead
				if (entry === '') {
					entry = element.nodeName.toLowerCase();
				}
				// add the suffix
				entry += ' ';
				suffix = '{}\n';
				// if the line doesn't exist yet
				if (css.indexOf(indentation + prefix + entry + suffix) < 0) {
					// add the entry to the stylesheet
					css += indentation + prefix + entry + suffix;
				}
			}
		}
		// for all of its child nodes
		for (a = 0 , b = children.length; a < b; a += 1) {
			// recurse
			css = _this.parse(children[a], recursion + 1, prefix + entry, css);
		}
		// return the  result
		return css;
	};

	this.byDashes = function () {

	};

	// EVENTS

	this.onInputChange = function (element) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			_this.update();
		};
	};

	this.onOptionChange = function (element) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			_this.config.options[element.name] = element.checked;
			_this.config.values[element.name] = element.value;
			_this.update(_this);
		};
	};

	this.onFormSubmit = function (element) {
		var _this = this;
		// set an event handler
		element.onsubmit = function () {
			_this.update();
			// cancel the submit
			return false;
		};
	};

	this.init(config);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = Htmltocss;
}

/*
	Source:
	van Creij, Maurice (2012). "useful.context.js: Generates an empty stylesheet from HTML.", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Htmltocss = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			var context = this;
			// set the form submit handler
			context.events.formSubmit(context.obj, context);
			// gather the text areas
			var textareas = context.obj.getElementsByTagName('textarea');
			context.cfg.input = textareas[0];
			context.cfg.output = textareas[1];
			context.events.inputChange(context.cfg.input, context);
			// gather the options
			var options = context.obj.getElementsByTagName('input');
			context.cfg.options = {};
			for (var a = 0, b = options.length; a < b; a += 1) {
				// if this is an actual option
				if (options[a].type === 'checkbox') {
					// note its state
					context.cfg.options[options[a].name] = options[a].checked;
					// add an event handler
					context.events.optionChange(options[a], context);
				}
			}
			// initial state
			context.update(context);
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.events = {};
		this.events.inputChange = function (element, context) {
			// set an event handler
			element.onchange = function () {
				context.update(context);
			};
		};
		this.events.optionChange = function (element, context) {
			// set an event handler
			element.onchange = function () {
				context.cfg.options[element.name] = element.checked;
				context.update(context);
			};
		};
		this.events.formSubmit = function (element, context) {
			// set an event handler
			element.onsubmit = function () {
				context.update(context);
				// cancel the submit
				return false;
			};
		};
		this.update = function (context) {
			// variables
			var dummy, output;
			// create a new dummy container
			dummy = document.createElement('div');
			// put the html from the input in the dummy container
			dummy.innerHTML = context.cfg.input.value;
			// pass the dummy through the redraw function
			output = context.parse(context, dummy, -1, '', '');
			// add the scss conversion step is needed
			if (context.cfg.options.compass) {
				output = context.convert(context, output);
			}
			//publish the result in the output
			context.cfg.output.value = output;
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
		this.convert = function (context, output) {
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
		this.parse = function (context, element, recursion, prefix, css) {
			// variables
			var a, b, indentation = '', entry = '', suffix = '', children = context.childnodes(element);
			// if the recursion is high enough
			if (recursion >= 0) {
				// add indentations based on the recursion
				indentation = '';
				if (context.cfg.options.indented || context.cfg.options.compass) {
					for (a = 0; a < recursion; a += 1) {
						indentation += '\t';
					}
				}
				// identify the element
				entry = element.nodeName.toLowerCase();
				if (element.id) {
					entry += '#' + element.id;
				}
				if (element.className) {
					entry += '.' + element.className.replace(/ /gi, '.');
				}
				// add the suffix
				entry += ' ';
				suffix = '{}\n';
				// reset the chain after an id
				if (context.cfg.options.fromid && entry.match(/#/gi)) {
					prefix = '';
				}
				// if the line doesn't exist yet
				if (css.indexOf(indentation + prefix + entry + suffix) < 0) {
					// add the entry to the stylesheet
					css += indentation + prefix + entry + suffix;
				}
			}
			// for all of its child nodes
			for (a = 0 , b = children.length; a < b; a += 1) {
				// recurse
				css = context.parse(context, children[a], recursion + 1, prefix + entry, css);
			}
			// return the  result
			return css;
		};
		// go
		this.start();
	};

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.htmltocss.js: Generates an empty stylesheet from HTML.", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var htmltocss = {};
	htmltocss = {
		// update chain
		setup : function (view, model) {
			// store the parent
			model.parent = view;
			htmltocss.events.formSubmit(model.parent, model);
			// gather the text areas
			var textareas = view.getElementsByTagName('textarea');
			model.input = textareas[0];
			model.output = textareas[1];
			htmltocss.events.inputChange(model.input, model);
			// gather the options
			var options = view.getElementsByTagName('input');
			model.options = {};
			for (var a = 0, b = options.length; a < b; a += 1) {
				// if this is an actual option
				if (options[a].type === 'checkbox') {
					// note its state
					model.options[options[a].name] = options[a].checked;
					// add an event handler
					htmltocss.events.optionChange(options[a], model);
				}
			}
			// initial state
			htmltocss.update(model);
		},
		events : {
			inputChange : function (element, model) {
				// set an event handler
				element.onchange = function () {
					htmltocss.update(model);
				};
			},
			optionChange : function (element, model) {
				// set an event handler
				element.onchange = function () {
					model.options[element.name] = element.checked;
					htmltocss.update(model);
				};
			},
			formSubmit : function (element, model) {
				// set an event handler
				element.onsubmit = function (event) {
					htmltocss.update(model);
					// cancel the submit
					useful.events.cancel(event);
				};
			}
		},
		update : function (model) {
			// variables
			var dummy, output;
			// create a new dummy container
			dummy = document.createElement('div');
			// put the html from the input in the dummy container
			dummy.innerHTML = model.input.value;
			// pass the dummy through the redraw function
			output = htmltocss.parse(model, dummy, -1, '', '');
			// add the scss conversion step is needed
			if (model.options.compass) {
				output = htmltocss.convert(model, output);
			}
			//publish the result in the output
			model.output.value = output;
			// clear the  dummy container
			dummy = null;
		},
		childnodes : function (parent) {
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
		},
		convert : function (model, output) {
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
		},
		parse : function (model, element, recursion, prefix, css) {
			// variables
			var a, b, indentation = '', entry = '', suffix = '', children = htmltocss.childnodes(element);
			// if the recursion is high enough
			if (recursion >= 0) {
				// add indentations based on the recursion
				indentation = '';
				if (model.options.indented || model.options.compass) {
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
				if (model.options.fromid && entry.match(/#/gi)) {
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
				css = htmltocss.parse(model, children[a], recursion + 1, prefix + entry, css);
			}
			// return the  result
			return css;
		}
	};

	// public functions
	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};

	useful.htmltocss = {};
	useful.htmltocss.setup = htmltocss.setup;

}(window.useful = window.useful || {}));

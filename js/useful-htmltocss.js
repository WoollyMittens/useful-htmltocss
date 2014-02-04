/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		if (!window.console) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

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
	};

}(window.useful = window.useful || {}));

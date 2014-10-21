'use strict';
/**
 *
 * 'De persgroep' library can be used just like jQuery but
 * our $ function is a layer to communicate with  minimalistic
 * 3rd party libraries:
 *
 *
 *  [Arbiter](http://arbiterjs.com)
 *  -------------------------------------
 *  A light-weight, library-agnostic javascript implementation of
 *  the pub/sub pattern
 *
 *  [Bonzo](https://github.com/ded/bonzo)
 *  -------------------------------------
 *  A library agnostic extensible DOM utility. Nothing else.
 *
 *  [Qwuery](https://github.com/ded/qwery)
 *  -------------------------------------
 *  Qwery is a modern selector engine built on top of querySelectorAll
 *  giving you practical utility.
 *
 *  [Bean](https://github.com/fat/bean)
 *  -------------------------------------
 *  A small, fast, cross-platform, framework-agnostic event manager
 *  designed for desktop, mobile, and touch-based browsers.
 *
 *  [Reqwest](https://github.com/ded/reqwest)
 *  -------------------------------------
 *  Ajax all over again! Includes support for xmlHttpRequest, JSONP,
 *  CORS and CommonJS Promises A.
 *
 * @class README
 *
 */
window.$ = null;

// make Bean and Bonzo use Qwery
// as their internal selector engine
bean.setSelectorEngine(qwery);
bonzo.setQueryEngine(qwery);

(function() {


/**
 *
 *  Return a collection of matched elements either found in the DOM based
 *  on passed argument(s) or created by passing an HTML string.
 *
 *	@param {String} selector A string containing a selector expression
 *  @param {Element,Bonzo} [context] A DOM Element, Document, or Bonzo object to use as context
 *
 *	@return {Bonzo} Bonzo An array of elements found matching the selector string
 *
 */
	$ = function (selector, node) {
		if (node) {
			return bonzo(qwery(selector, node));
		}
		return bonzo(qwery(selector));
	};

	function indexOf (collection, item) {
		for (var i = 0; i < collection.length; i++) {
			if (collection[i] === item) {
				return i;
			}
		}
		return -1;
	}

	// $() will return a bonzo object
	// let's extend bonzo :)
	bonzo.aug({
		/**
		 *
		 *	@method on
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	lets you attach event listeners to both elements and objects.
		 *
		 *	@param {String} eventType An event (or multiple events, space separated) to listen to
		 *  @param {String} [selector] A CC DOM Element selector string to bind the listener to child elements matching the selector
		 *	@param {function} handler The callback function
		 *	@param {arguments} [args] Additional arguments to pass to the callback function
		 *
		 *	@example
		 *
		 *		$('.selector').on('click', function(){
		 *		// do something
		 *	});
		 *
		 *
		 *		$('.selector').on('click.action', function(e){
		 *		e.preventDefault();
		 *		// do other stuff
		 *	});
		 *
		 */
		on: function () {
			var args = [].slice.call(arguments);
			args.unshift('');
			return this.each(function (elem) {
				args[0] = elem;
				return bean.on.apply(this, args);
			});
		},
		/**
		 *
		 *	@method one
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	one() is an alias for bean.on() except that the handler will only be executed once
		 *	and then removed for the event type(s).
		 *
		 */
		one: function () {
			var args = [].slice.call(arguments);
			args.unshift('');
			return this.each(function (elem) {
				args[0] = elem;
				return bean.one.apply(elem, args);
			});
		},
		/**
		 *
		 *	@method off
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	off() is how you get rid of handlers once you no longer want them active.
		 *	It's also a good idea to call off on elements before you remove them from your DOM;
		 *	this gives Bean a chance to clean up some things and prevents memory leaks.
		 *
		 *	@param {String} eventType An event (or multiple events, space separated) to listen to
		 *	@param {function} [args] the specific callback function to remove
		 *
		 */
		off: function () {
			var args = [].slice.call(arguments);
			args.unshift('');
			return this.each(function (elem) {
				args[0] = elem;
				return bean.off.apply(elem, args);
			});
		},
		/**
		 *
		 *	@method fire
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	fire() gives you the ability to trigger events.
		 *
		 *	@param {String} eventType An event (or multiple events, space separated) to listen to
		 *	@param {arguments} [handler] Additional arguments to pass to the callback function
		 *
		 */
		fire: function () {
			var args = [].slice.call(arguments);
			args.unshift('');
			return this.each(function (elem) {
				args[0] = elem;
				return bean.fire.apply(elem, args);
			});
		},
		// extra functionality
		/**
		 *
		 *	@method find
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	Get the descendants of each element in the current set of matched elements, filtered
		 *	by a selector, Bonzo object, or element.
		 *
		 *	@param {String} Selector A string containing a selector expression to match elements against.
		 *
		 */
		find: function(s) {
			var r = [],
				i, l, j, k, els;
			for (i = 0, l = this.length; i < l; i++) {
				els = qwery(s, this[i]);
				for (j = 0, k = els.length; j < k; j++) {
					r.push(els[j]);
				}
			}
			return $(qwery.uniq(r));
		},
		/**
		 *
		 *	@method parents
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	Get the ancestors of each element in the current set of matched elements, optionally
		 *	filtered by a selector.
		 *
		 *	@param {String} Selector A string containing a selector expression to match elements against.
		 *
		 */
		parents: function(selector, closest) {
			// console.log("collection: ",$(selector), selector);
			var collection = $(selector),
				j, k, p, r = [];
			for (j = 0; j < this.length; j++) {
				p = this[j];
				k = p.parentNode;
				while (k) {
					if (selector && indexOf(collection, k) !== -1) {
						r.push(k);
						if (closest) {
							break;
						}
					}else if (!selector){
						r.push(k);
					}
					k = k.parentNode;
				}
			}
			return $(qwery.uniq(r));
		},
		/**
		 *
		 *	@method children
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	Get the children of each element in the set of matched elements, optionally
		 *	filtered by a selector.
		 *
		 *	@param {String} Selector A string containing a selector expression to match elements against.
		 *
		 */
		children: function() {
			var i, l, r = [];
			for (i = 0; i < this.length; i++) {
				if (this[i].childNodes){
					for (l = 0; l < this[i].childNodes.length;l++){
						if (this[i].childNodes[l].nodeType === 1){
							r.push(this[i].childNodes[l]);
						}
					}
				}
			}
			return $(qwery.uniq(r));
		},
		// siblings: function() {
		//     var i, l, p, r = [];
		//     for (i = 0; i < this.length; i++) {
		//         p = this[i];
		//         l = p.previousSibling;
		//         while (l){
		//             if (l.nodeType === 1){
		//                 r.push(p);
		//             }
		//             l = l.previousSibling;
		//         }
		//         p = this[i];
		//         l = p.nextSibling;
		//         while (l){
		//             if (l.nodeType === 1){
		//                 r.push(l);
		//             }
		//             l = l.nextSibling;
		//         }
		//     }
		//     return $(r);
		// },
		/**
		 *
		 *	@method closest
		 *	@for $
		 *  @chainable
		 *
		 *	@description
		 *	For each element in the set, get the first element that matches the selector by testing the
		 *  element itself and traversing up through its ancestors in the DOM tree.
		 *
		 *	@param {String} Selector A string containing a selector expression to match elements against.
		 *
		 */
		closest: function(selector) {
			return this.parents(selector, true);
		},
		clone: function(deepClone){
			var i = 0,
				r = [],
				div = document.createElement('div'),
				supportsHTML5 = !!document.createElement('canvas').getContext;
			deepClone = deepClone || false;
			for (;i<this.length;i++){
				if (supportsHTML5){
					r.push(this[i].cloneNode(deepClone));
				}else{
					div.innerHTML = this[i].outerHTML;
					r.push(div.firstChild);
				}
			}
			return $(qwery.uniq(r));
		},
		index: function (haystack) {
			haystack = haystack || this.parent().children();
			var needle = this.get(0),
				index = -1,
				i = 0;
			haystack.each(function(elem) {
				if(elem === needle) {
					index = i;
				}
				i++;
			});
			return index;
		}
	});

	// reqwest
	$.ajax = function(){
		// use reqwest
		reqwest.apply(this, arguments);
	};

	// Arbiter
	$.publish = function(){
		return Arbiter.publish.apply(this, arguments);
	};

	$.subscribe = function(){
		return Arbiter.subscribe.apply(this, arguments);
	};

	$.unsubscribe = function(){
		return Arbiter.unsubscribe.apply(this, arguments);
	};

	$.resubscribe = function(){
		return Arbiter.resubscribe.apply(this, arguments);
	};

	// custom code

	$.parseHTML = function(htmlString){
		var h = document.createElement('div');
		h.innerHTML = htmlString;
		return $(h).children();
	};

	$.template = function(id){

		var temp = $.parseHTML($('template#'+id).html());
		$('[data-id]', temp).each(function(){
			this.id = this.getAttribute('data-id');
		});
		return temp;

	};

	$.serialize = function (form) {
		var q = $.serializeObject(form);
		return q.join('&');
	};

	$.serializeObject = function (form){
		if (!form || form.nodeName !== 'FORM') {
			return;
		}
		var i, j, q = [];
		for (i = form.elements.length - 1; i >= 0; i = i - 1) {
			if (form.elements[i].name === '') {
				continue;
			}
			switch (form.elements[i].nodeName) {
			case 'INPUT':
				switch (form.elements[i].type) {
				case 'checkbox':
				case 'radio':
					if (form.elements[i].checked) {
						q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
					}
					break;
				case 'file':
					break;
				default:
					q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
				}
				break;
			case 'TEXTAREA':
				q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
				break;
			case 'SELECT':
				switch (form.elements[i].type) {
				case 'select-one':
					q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
					break;
				case 'select-multiple':
					for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
						if (form.elements[i].options[j].selected) {
							q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].options[j].value));
						}
					}
					break;
				}
				break;
			case 'BUTTON':
				switch (form.elements[i].type) {
				case 'reset':
				case 'submit':
				case 'button':
					q.push(form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value));
					break;
				}
				break;
			}
		}
		return q;
	};

	/**
	* $.browser('ie6') to check for current client bowser.
	*
	* @param {String} browser Can be [ie | ie6 | ie7 | ie8 | ie9 | lte7 | lte8 | lte9] or non of them.
	* @return {Boolean} Returns true if browser matches current client browser
	*/
	$.browser = function(browser) {
		var browserMetaTag = $('meta[name=browser]'),
			browserIdentifiers = [];

		if (browserMetaTag.length) {
			browserMetaTag = browserMetaTag[0];
			browserIdentifiers = browserMetaTag.content.split(' ');

			return indexOf(browserIdentifiers, browser) > -1 ? true : false;
		}

		return false;
	};

	$.breakpoint = function() {

		var width = util.getWindowWidth(),
			breakpoints = App.config.breakpoints,
			device;

		if (width < breakpoints.mobile) {
			device = 'small';
		} else if (width < breakpoints.tablet) {
			device = 'medium';
		} else {
			device = 'large';
		}

		return device;
	};

	return $;

})();

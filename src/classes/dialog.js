'use strict';
/**
 *
 *	Modals you say? Lightboxes? What's in a name. This thing uses
 *	the WAI ARIA specced items to create modals
 *
 *
 *	@class Dialog
 *	@constructor
 *	@requires Toggle
 *
 *
 *	@property {Bonzo} trigger The dom element item that needs to have tab functionality
 *	@property {boolean} [overlay] does the modal has an overlay, default true
 *	@property {String} [close] the class of the close button, default is none
 *	@property {object} [position] the x / y coordinates. default is 50 / 50 percent
 *	@property {function} onShow callback function when the dialog is shown
 *	@property {function} onHide callback function when the dialog is hidden
 *
 *	@example
 *
 *		new Dialog({
 *		trigger: $('.modal-trigger'),
 *		closer: '.close'
 *	});
 *
 *
 */
function Dialog(args) {
	if (args) {
		var _this = this;

		_this.defaults = {
				trigger: (args.trigger ? args.trigger : null),
				overlay: (args.overlay === false ? args.overlay : true),
				closer: (args.close ? args.close : false),
				position: (args.position ? args.position : {
					x: '50%',
					y: '50%'
				}),
				onShow: (args.onShow ? args.onShow : function() {}),
				onHide: (args.onHide ? args.onHide : function() {})
			};

		// create toggle modules without global close
		$(_this.defaults.trigger).each(function() {
			// if we have a panel create a toggle
			var trigger = $(this),
				id = trigger.attr('data-trigger'),
				modal = $('*[data-modal="' + id + '"]');

			if (id && modal.length) {
				trigger.data('toggle',
					new Toggle({
						trigger: this,
						toggle: modal,
						globalClose: false,
						onShow: function() {
							_this.show(trigger, modal);
						},
						onHide: function() {
							_this.hide(trigger, modal);
						}
					})
				);

				if (_this.defaults.closer) {
					$(_this.defaults.closer, modal).on('click.dialog.close', function() {
						var tgl = $(_this.defaults.trigger).data('toggle');

						if (tgl) {
							tgl.hide.call(tgl);
						}
					});
				}
			}
		});
	}

	return this;
}

/**
 *
 *	@method show
 *	@for Dialog
 *
 *	@description
 *	calls the show callback function
 *
 *	@example
 *
 *		var obj = new Dialog({
 *	trigger: $('.modal-trigger'),
 *	closer: '.close'
 *	});
 *	obj.show();
 *
 */
Dialog.prototype.show = function(trigger, modal) {
	if (this.defaults && trigger && modal) {
		App.views.dialog.unshift($(this.defaults.trigger).data('toggle'));

		this.defaults.onShow.call(this, {
			overlay: this.defaults.overlay,
			modal: modal,
			trigger: trigger,
			position: this.defaults.position
		});
	}

	return this;
};

/**
 *
 *	@method hide
 *	@for Dialog
 *
 *	@description
 *	calls the hide callback function
 *
 *	@example
 *
 *		var obj = new Dialog({
 *	trigger: $('.modal-trigger'),
 *	closer: '.close'
 *	});
 *	obj.hide();
 *
 */
Dialog.prototype.hide = function(trigger, modal) {
	if (this.defaults) {
		if (App.views.dialog.length) {
			App.views.dialog.shift();
		}

		this.defaults.onHide.call(this, {
			overlay: this.defaults.overlay,
			modal: modal,
			trigger: trigger,
			position: this.defaults.position
		});
	}

	return this;
};

Dialog.prototype.destroy = function() {
	var _this = this;

	if (this.defaults) {
		$(this.defaults.trigger).each(function() {
			if ($(this).data('toggle')) {
				$(this).data('toggle').destroy();
				$(this).data('toggle', '');
			}

			var trigger = $(this),
				id = trigger.attr('data-trigger'),
				modal = $('*[data-modal="' + id + '"]');

			if (_this.defaults.closer) {
				$(_this.defaults.closer, modal).each(function() {
					bean.off(this, 'click.dialog');
				});
			}
		});
	}

	return this;
};

'use strict';
function Dialog(args){

	var _this = this;

	_this.defaults = {
			trigger: (args.trigger ? args.trigger : null),
			overlay: (args.overlay === false ? args.overlay : true),
			closer: (args.close ? args.close : false),
			position: (args.position ? args.position : {x: '50%', y: '50%'}),
			onShow: (args.onShow ? args.onShow : $.noop),
			onHide: (args.onHide ? args.onHide : $.noop),
		};

	// console.log('we have to create a dialog');

	// create toggle modules without global close
	$(_this.defaults.trigger).each(function(){
		// if we have a panel create a toggle
		var trigger = $(this),
			id = trigger.attr('data-trigger'),
			modal = $('*[data-modal="' + id + '"]');
		if (id && modal.length){
			trigger.data('toggle',
				new Toggle({
					trigger: this,
					toggle: modal,
					globalClose: false,
					onShow: function(){
						_this.show(trigger, modal);
					},
					onHide: function(){
						_this.hide(trigger, modal);
					}
				})
			);
			if (_this.defaults.closer){
				$(_this.defaults.closer, modal).on('click.dialog.close', function(){
					var tgl = $(_this.defaults.trigger).data('toggle');
					if (tgl){
						tgl.hide.call(tgl);
					}
				});
			}
		}
	});

	return _this;

}

Dialog.prototype.show = function(trigger, modal){

	App.views.dialog.unshift($(this.defaults.trigger).data('toggle'));

	this.defaults.onShow.call(this, {
		overlay: this.defaults.overlay,
		modal: modal,
		trigger: trigger,
		position: this.defaults.position
	});

};

Dialog.prototype.hide = function(trigger, modal){

	if (App.views.dialog.length){
		App.views.dialog.shift();
	}

	this.defaults.onHide.call(this, {
		overlay: this.defaults.overlay,
		modal: modal,
		trigger: trigger,
		position: this.defaults.position
	});

};

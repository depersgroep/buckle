'use strict';
function Popover(args){

	var _this = this;

	_this.defaults = {
			bigPopover: args.bigPopover ? args.bigPopover : false,
			trigger: (args.trigger ? args.trigger : null),
			onShow: (args.onShow ? args.onShow : $.noop),
			onHide: (args.onHide ? args.onHide : $.noop),
			closer: (args.closer ? args.closer : false),
			popover: (args.popover ? args.popover : false)
		};

	// create toggle modules with global close
	$(_this.defaults.trigger).each(function(){
		var trigger = $(this);
		trigger.data('toggle', new Toggle({
				trigger: this,
				toggle: _this.defaults.popover,
				globalClose: true,
				onShow: function(){
					_this.show({
						trigger: trigger,
						popover: _this.defaults.popover,
						bigPopover: _this.defaults.bigPopover
					});
				},
				onHide: function(){
					_this.hide({
						trigger: trigger,
						popover: _this.defaults.popover,
						bigPopover: _this.defaults.bigPopover
					});
				}
			}));
		if (_this.defaults.closer){
			$(_this.defaults.popover).each(function() {
				bean.on(this, 'click', _this.defaults.closer, function(e){
					e.preventDefault();
					_this.hide({
						trigger: trigger,
						popover: _this.defaults.popover,
						bigPopover: _this.defaults.bigPopover
					});
				});
			});
		}
	});

	return _this;

}

Popover.prototype.show = function(args) {
	App.views.popover.unshift($(this.defaults.trigger).data('toggle'));

	Arbiter.publish('/popover/show', args);

};

Popover.prototype.recalculate = function() {

	var _this = this;

	Arbiter.publish('/popover/recalculate', {
		trigger: _this.defaults.trigger,
		popover: _this.defaults.popover,
		bigPopover: _this.defaults.bigPopover
	});

};

Popover.prototype.hide = function(args) {
	if (App.views.popover.length){
		var idx = App.views.popover.indexOf($(this.defaults.trigger).data('toggle'));
		App.views.popover.splice(idx, 1);
	}

	Arbiter.publish('/popover/hide', args);

};

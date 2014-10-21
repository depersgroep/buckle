'use strict';
function Toggle(args){

	var _this = this;

	if (args){

		this.defaults = {
				toggle: (args.toggle ? args.toggle : null),
				trigger: (args.trigger ? args.trigger : null),
				state: (args.state ? args.state : false),
				globalClose: (args.globalClose === false ? args.globalClose : true),
				noPreventDefault: (args.noPreventDefault ? args.noPreventDefault : false),
				toggleClick: (args.toggleClick === false ? args.toggleClick : true),
				mouseEvent: (args.mouseEvent ? args.mouseEvent : 'click'),
				onShow: (args.onShow ? args.onShow : function(){}),
				onHide: (args.onHide ? args.onHide : function(){}),
				onToggle: (args.onToggle ? args.onToggle : function(){})
			};
		if (this.defaults.toggle && this.defaults.trigger) {
			if (this.defaults.mouseEvent === 'hover') {
				$(this.defaults.trigger).on('mouseover.toggle mouseout.toggle', function(){
					_this.toggle();
				});
			} else {
				$(this.defaults.trigger).on('click.toggle.trigger', function(e){
					if(!_this.defaults.noPreventDefault){
						e.preventDefault();
					}
					_this.toggle();
				});
			}
		}
		if (this.defaults.state){
			this.show();
		}
	}

	return this;

}

Toggle.prototype.toggle = function() {

	if (this.defaults){
		if (this.defaults.toggleClick){
			if (this.defaults.state){
				this.hide();
			}else{
				this.show();
			}
		}else{
			this.show();
		}
		this.defaults.onToggle.call(this.defaults.toggle);
	}

	return this;

};

Toggle.prototype.show = function(){

	if (this.defaults){

		this.defaults.state = true;

		Arbiter.publish('/toggle/show', {
			toggle: this.defaults.toggle
		});

		if (this.defaults.globalClose){

			$(document).on('click.toggle.globalclose', function(e, args){
				var _this = args._this,
					toggleIsOrContainsTarget = $(_this.defaults.toggle)[0].contains(e.target) ||
					$(_this.defaults.toggle)[0] === e.target,
					triggerIsOrContainsTarget = $(_this.defaults.trigger)[0].contains(e.target) ||
					$(_this.defaults.trigger)[0] === e.target;
				if (!toggleIsOrContainsTarget && !triggerIsOrContainsTarget){
					_this.hide(true);
				}
			}, {_this: this});

		}

		this.defaults.onShow.call(this.defaults.toggle);
	}

	return this;

};

Toggle.prototype.hide = function(){

	if (this.defaults){

		this.defaults.state = false;
		Arbiter.publish('/toggle/hide', {
			toggle: this.defaults.toggle
		});
		this.defaults.onHide.call(this.defaults.toggle);

		if (this.defaults.globalClose){
			$(document).off('click.toggle.globalclose', this.hide);
		}

	}

	return this;

};

Toggle.prototype.destroy = function() {
	// destroy it
	var _this = this;
	if (this.defaults){
		Arbiter.publish('/toggle/destroy', this.defaults);
		$(_this.defaults.trigger).off('click.toggle mouseover.toggle mouseout.toggle');
		$(document).off('click.toggle', this.hide);
		// remove the defaults
		this.defaults = null;
	}

	return this;
};

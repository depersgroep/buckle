'use strict';
function Tabs(args){

	if (args){
		var _this = this;

		this.defaults = {
				tabs: (args.tabs ? args.tabs : null),
				mouseEvent: (args.mouseEvent ? args.mouseEvent : 'click'),
				onTabChange: (args.onTabChange ? args.onTabChange : function(){}),
				noPreventDefault: (args.noPreventDefault ? args.noPreventDefault : false)
			};

		// create toggle modules without global close
		$(this.defaults.tabs).each(function(){
			// if we have a panel create a toggle
			var tab = $(this),
				id = tab.attr('aria-controls');
			if (id){
				tab.data('toggle',
					new Toggle({
						trigger: tab,
						toggle: $('#' + id),
						mouseEvent: _this.defaults.mouseEvent,
						globalClose: false,
						toggleClick: false,
						onShow: function(){
							_this.show(tab);
						},
						noPreventDefault: _this.defaults.noPreventDefault
					})
				);
			}
		});
	}

	return this;

}

Tabs.prototype.show = function(tab){

	if (tab && this.defaults){
		var _this = this;

		// loop throug the tabs that are not the active one and hide them
		$(this.defaults.tabs).each(function(){
			_this.hide($(this));
		});

		Arbiter.publish('/tabs/show', {
			tab: tab,
			pane: $('#' + tab.attr('aria-controls'))
		});

		_this.defaults.onTabChange.call(_this);
	}

	return this;

};

Tabs.prototype.hide = function(tab){

	if (tab && this.defaults){
		// hide the tab
		tab.data('toggle').hide();

		Arbiter.publish('/tabs/hide', {
			tab: tab,
			pane: $('#' + tab.attr('aria-controls'))
		});
	}

	return this;

};

Tabs.prototype.destroy = function(){

	if (this.defaults){
		$(this.defaults.tabs).each(function(){
			// if we have a panel create a toggle
			var tab = $(this);
			if (tab.data('toggle')){
				tab.data('toggle').destroy();
				tab.data('toggle', '');
			}
		});
	}

	return this;

};

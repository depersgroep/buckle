"use strict";function Tabs(args){if(args){var _this=this;this.defaults={tabs:args.tabs?args.tabs:null,mouseEvent:args.mouseEvent?args.mouseEvent:"click",onTabChange:args.onTabChange?args.onTabChange:function(){},noPreventDefault:args.noPreventDefault?args.noPreventDefault:!1},$(this.defaults.tabs).each(function(){var tab=$(this),id=tab.attr("aria-controls");id&&tab.data("toggle",new Toggle({trigger:tab,toggle:$("#"+id),mouseEvent:_this.defaults.mouseEvent,globalClose:!1,toggleClick:!1,onShow:function(){_this.show(tab)},noPreventDefault:_this.defaults.noPreventDefault}))})}return this}Tabs.prototype.show=function(tab){if(tab&&this.defaults){var _this=this;$(this.defaults.tabs).each(function(){_this.hide($(this))}),Arbiter.publish("/tabs/show",{tab:tab,pane:$("#"+tab.attr("aria-controls"))}),_this.defaults.onTabChange.call(_this)}return this},Tabs.prototype.hide=function(tab){return tab&&this.defaults&&(tab.data("toggle").hide(),Arbiter.publish("/tabs/hide",{tab:tab,pane:$("#"+tab.attr("aria-controls"))})),this},Tabs.prototype.destroy=function(){return this.defaults&&$(this.defaults.tabs).each(function(){var tab=$(this);tab.data("toggle")&&(tab.data("toggle").destroy(),tab.data("toggle",""))}),this};
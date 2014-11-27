"use strict";function Toggle(args){var _this=this;return args&&(this.defaults={toggle:args.toggle?args.toggle:null,trigger:args.trigger?args.trigger:null,state:args.state?args.state:!1,globalClose:args.globalClose===!1?args.globalClose:!0,noPreventDefault:args.noPreventDefault?args.noPreventDefault:!1,toggleClick:args.toggleClick===!1?args.toggleClick:!0,mouseEvent:args.mouseEvent?args.mouseEvent:"click",onShow:args.onShow?args.onShow:function(){},onHide:args.onHide?args.onHide:function(){},onToggle:args.onToggle?args.onToggle:function(){}},this.defaults.toggle&&this.defaults.trigger&&("hover"===this.defaults.mouseEvent?$(this.defaults.trigger).on("mouseover.toggle mouseout.toggle",function(){_this.toggle()}):$(this.defaults.trigger).on("click.toggle.trigger",function(e){_this.defaults.noPreventDefault||e.preventDefault(),_this.toggle()})),this.defaults.state&&this.show()),this}Toggle.prototype.toggle=function(){return this.defaults&&(this.defaults.toggleClick&&this.defaults.state?this.hide():this.show(),this.defaults.onToggle.call(this.defaults.toggle)),this},Toggle.prototype.show=function(){return this.defaults&&(this.defaults.state=!0,Arbiter.publish("/toggle/show",{toggle:this.defaults.toggle}),this.defaults.globalClose&&$(document).on("click.toggle.globalclose",function(e,args){var _this=args._this,toggleIsOrContainsTarget=$(_this.defaults.toggle)[0].contains(e.target)||$(_this.defaults.toggle)[0]===e.target,triggerIsOrContainsTarget=$(_this.defaults.trigger)[0].contains(e.target)||$(_this.defaults.trigger)[0]===e.target;toggleIsOrContainsTarget||triggerIsOrContainsTarget||_this.hide(!0)},{_this:this}),this.defaults.onShow.call(this.defaults.toggle)),this},Toggle.prototype.hide=function(){return this.defaults&&(this.defaults.state=!1,Arbiter.publish("/toggle/hide",{toggle:this.defaults.toggle}),this.defaults.onHide.call(this.defaults.toggle),this.defaults.globalClose&&$(document).off("click.toggle.globalclose",this.hide)),this},Toggle.prototype.destroy=function(){var _this=this;return this.defaults&&(Arbiter.publish("/toggle/destroy",this.defaults),$(_this.defaults.trigger).off("click.toggle mouseover.toggle mouseout.toggle"),$(document).off("click.toggle",this.hide),this.defaults=null),this};
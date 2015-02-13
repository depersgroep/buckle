"use strict";function Toggle(t){var e=this;return t&&(this.defaults={toggle:t.toggle?t.toggle:null,trigger:t.trigger?t.trigger:null,state:t.state?t.state:!1,globalClose:t.globalClose===!1?t.globalClose:!0,noPreventDefault:t.noPreventDefault?t.noPreventDefault:!1,toggleClick:t.toggleClick===!1?t.toggleClick:!0,debug:t.debug?t.debug:!1,mouseEvent:t.mouseEvent?t.mouseEvent:"click",onShow:t.onShow?t.onShow:function(){},onHide:t.onHide?t.onHide:function(){},onToggle:t.onToggle?t.onToggle:function(){}},this.defaults.toggle&&this.defaults.trigger&&("hover"===this.defaults.mouseEvent?$(this.defaults.trigger).on("mouseover.toggle mouseout.toggle",function(){e.toggle()}):$(this.defaults.trigger).on("click.toggle.trigger",function(t){e.defaults.noPreventDefault||t.preventDefault(),e.toggle()})),this.defaults.state&&this.show()),this}Toggle.prototype.toggle=function(){return this.defaults&&(this.defaults.toggleClick&&this.defaults.state?this.hide():this.show(),this.defaults.onToggle.call(this.defaults.toggle)),this},Toggle.prototype.show=function(){return this.defaults&&(this.defaults.state=!0,Arbiter.publish("/toggle/show",{toggle:this.defaults.toggle}),this.defaults.globalClose?(this.defaults.debug&&console.log("has globalClose"),$(document).on("click.toggle.globalclose",function(t,e){console.log("added");var o=e._this,l=$(o.defaults.toggle)[0].contains(t.target)||$(o.defaults.toggle)[0]===t.target,g=$(o.defaults.trigger)[0].contains(t.target)||$(o.defaults.trigger)[0]===t.target;l||g||o.hide(!0)},{_this:this})):this.defaults.debug&&console.log("doesn't have globalClose"),this.defaults.onShow.call(this.defaults.toggle)),this},Toggle.prototype.hide=function(){return this.defaults&&(this.defaults.state=!1,Arbiter.publish("/toggle/hide",{toggle:this.defaults.toggle}),this.defaults.onHide.call(this.defaults.toggle),this.defaults.globalClose&&$(document).off("click.toggle.globalclose",this.hide)),this},Toggle.prototype.destroy=function(){var t=this;return this.defaults&&(console.log("destroyed"),Arbiter.publish("/toggle/destroy",this.defaults),$(t.defaults.trigger).off("click.toggle mouseover.toggle mouseout.toggle"),$(document).off("click.toggle",this.hide),this.defaults=null),this};
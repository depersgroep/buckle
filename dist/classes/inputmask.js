"use strict";function Inputmask(t){var a,e,s,u,n,r,i,l,p=this,f=/\d+/g,o=/[^\d+]/g,d=!1;t&&(this.defaults={inputmask:t.inputmask?t.inputmask:null,pattern:t.pattern?t.pattern:null,maskCharacter:t.maskCharacter?t.maskCharacter:null,separatorCharacter:t.separatorCharacter?t.separatorCharacter:null},this.defaults.inputmask&&"input"===this.defaults.inputmask.tagName.toLowerCase()&&"function"==typeof this.defaults.inputmask.setSelectionRange&&this.defaults.pattern&&this.defaults.maskCharacter&&this.defaults.separatorCharacter&&(c(),m()));function c(){var t=$(p.defaults.inputmask);t.on("focus.inputmask",k),t.on("blur.inputmask",h),x()?(t.on("input.inputmask",C),t.on("keyup.inputmask",w)):t.on("keydown.inputmask",g,t),t.on("mouseup.inputmask",w),t.on("paste.inputmask",y)}function m(){a=p.defaults.inputmask.value||p.defaults.pattern,s=new RegExp(p.defaults.maskCharacter,"g"),u=new RegExp(p.defaults.separatorCharacter,"g"),n=(p.defaults.pattern.match(s)||[]).length,r=R(p.defaults.inputmask.value||p.defaults.pattern),i=r.length,l=p.defaults.pattern.length,d=window.navigator.userAgent.toLowerCase().indexOf("iemobile")>=0}function k(){""===p.defaults.inputmask.value&&(p.defaults.inputmask.value=p.defaults.pattern),window.setTimeout(function(){var t=p.defaults.inputmask.value.indexOf(p.defaults.maskCharacter);t>=0&&O(t),e=S()},0)}function h(){p.defaults.inputmask.value===p.defaults.pattern&&(p.defaults.inputmask.value="")}function g(t,a){var e=t.keyCode||t.which;e>=96&&105>=e&&(e-=48),(48>e||e>57)&&8!==e&&46!==e&&37!==e&&39!==e?(a.off("keyup.inputmask"),t.preventDefault()):a.off("keyup.inputmask").on("keyup.inputmask",v)}function v(t){w(t),C()}function C(){d?window.setTimeout(b,0):b()}function b(){var t,d,c,m,k=S(),h=p.defaults.inputmask.value,g=0,v=0,C=!1,b=-1;for(a.length>h.length?e===k?a.substr(k,1)===p.defaults.separatorCharacter&&(h=h.substr(0,k)+p.defaults.separatorCharacter+h.substr(k+1),k+=1):h.substr(k-1,1)===p.defaults.separatorCharacter?k-=1:a.substr(k,1)===p.defaults.separatorCharacter&&(h=h.substr(0,k-1)+p.defaults.separatorCharacter+h.substr(k),k-=1):(d=(h.replace(s,"").replace(u,"").match(o)||[]).length,d>0?k-=d:C=!0,k>e&&a.substr(k-1,1)===p.defaults.separatorCharacter&&(k+=1)),t=(h.match(f)||[]).join(""),c=n-t.length,g;c>g;g++)t+="_";for(v;i>v;v++)t=t.substr(0,r[v])+p.defaults.separatorCharacter+t.substr(r[v]);t.length>l&&(t=t.substr(0,l)),p.defaults.inputmask.value=t,a=p.defaults.inputmask.value,C&&(b=t.indexOf(p.defaults.maskCharacter),m=t.substr(k,1),b>=0&&(m===p.defaults.maskCharacter||""===m)&&(k=b)),e=k,O(k)}function y(t){t.preventDefault()}function w(t){var a=t.keyCode||t.which;("keyup"!==t.type||"keyup"===t.type&&37===a||39===a||229===a)&&(e=S())}function x(){return"oninput"in p.defaults.inputmask&&"undefined"!=typeof window.atob}function R(t){for(var a,e=[],s=0;(a=t.indexOf(p.defaults.separatorCharacter,s))>=0;)s=a+1,e.push(a);return e}function S(){var t,a,e=0;return document.selection?(p.defaults.inputmask.focus(),t=document.selection.createRange(),a=t.text.length,t.moveStart("character",-p.defaults.inputmask.value.length),e=t.text.length-a):(p.defaults.inputmask.selectionStart||"0"===p.defaults.inputmask.selectionStart)&&(e=p.defaults.inputmask.selectionStart),e}function O(t){var a;null!==p.defaults.inputmask&&(p.defaults.inputmask.createTextRange?(a=p.defaults.inputmask.createTextRange(),a.move("character",t),a.select()):p.defaults.inputmask.selectionStart?(p.defaults.inputmask.focus(),p.defaults.inputmask.setSelectionRange(t,t)):p.defaults.inputmask.focus())}return this}Inputmask.prototype.destroy=function(){return this.defaults&&(Arbiter.publish("/inputmask/destroy",this.defaults),$(this.defaults.inputmask).off("focus.inputmask blur.inputmask input.inputmask keyup.inputmask keydown.inputmask paste.inputmask"),this.defaults=null),this};
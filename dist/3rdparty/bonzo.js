!function(t,e,n){"undefined"!=typeof module&&module.exports?module.exports=n():"function"==typeof define&&define.amd?define(n):e[t]=n()}("bonzo",this,function(){var t,e,n,i=window,r=i.document,o=r.documentElement,l="parentNode",s=/^(checked|value|selected|disabled)$/i,u=/^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i,f=/\s*<script +src=['"]([^'"]+)['"]>/,c=["<table>","</table>",1],a=["<table><tbody><tr>","</tr></tbody></table>",3],h=["<select>","</select>",1],d=["_","",0,1],p={thead:c,tbody:c,tfoot:c,colgroup:c,caption:c,tr:["<table><tbody>","</tbody></table>",2],th:a,td:a,col:["<table><colgroup>","</colgroup></table>",2],fieldset:["<form>","</form>",1],legend:["<form><fieldset>","</fieldset></form>",2],option:h,optgroup:h,script:d,style:d,link:d,param:d,base:d},y=/^(checked|selected|disabled)$/,g=/msie/i.test(navigator.userAgent),m={},v=0,b=/^-?[\d\.]+$/,x=/^data-(.+)$/,T="px",w="setAttribute",C="getAttribute",N="getElementsByTagName",S=function(){var t=r.createElement("p");return t.innerHTML='<a href="#x">x</a><table style="float:left;"></table>',{hrefExtended:"#x"!=t[N]("a")[0][C]("href"),autoTbody:0!==t[N]("tbody").length,computedStyle:r.defaultView&&r.defaultView.getComputedStyle,cssFloat:t[N]("table")[0].style.styleFloat?"styleFloat":"cssFloat",transform:function(){var e,n=["transform","webkitTransform","MozTransform","OTransform","msTransform"];for(e=0;e<n.length;e++)if(n[e]in t.style)return n[e]}(),classList:"classList"in t,opasity:function(){return"undefined"!=typeof r.createElement("a").style.opacity}()}}(),E=/(^\s*|\s*$)/g,L=/\s+/,H=String.prototype.toString,$={lineHeight:1,zoom:1,zIndex:1,opacity:1,boxFlex:1,WebkitBoxFlex:1,MozBoxFlex:1},W=r.querySelectorAll&&function(t){return r.querySelectorAll(t)},A=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(E,"")},B=S.computedStyle?function(t,e){var n=null,i=r.defaultView.getComputedStyle(t,"");return i&&(n=i[e]),t.style[e]||n}:g&&o.currentStyle?function(t,e){var n,i;if("opacity"==e&&!S.opasity){n=100;try{n=t.filters["DXImageTransform.Microsoft.Alpha"].opacity}catch(r){try{n=t.filters("alpha").opacity}catch(o){}}return n/100}return i=t.currentStyle?t.currentStyle[e]:null,t.style[e]||i}:function(t,e){return t.style[e]};function M(t){return t&&t.nodeName&&(1==t.nodeType||11==t.nodeType)}function F(t,e,n){var i,r,o;if("string"==typeof t)return tt.create(t);if(M(t)&&(t=[t]),n){for(o=[],i=0,r=t.length;r>i;i++)o[i]=_(e,t[i]);return o}return t}function O(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")}function z(t,e,n,i){for(var r,o=0,l=t.length;l>o;o++)r=i?t.length-o-1:o,e.call(n||t[r],t[r],r,t);return t}function k(t,e,n){for(var i=0,r=t.length;r>i;i++)M(t[i])&&(k(t[i].childNodes,e,n),e.call(n||t[i],t[i],i,t));return t}function D(t){return t.replace(/-(.)/g,function(t,e){return e.toUpperCase()})}function P(t){return t?t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase():t}function I(t){t[C]("data-node-uid")||t[w]("data-node-uid",++v);var e=t[C]("data-node-uid");return m[e]||(m[e]={})}function V(t){var e=t[C]("data-node-uid");e&&delete m[e]}function q(t){var e;try{return null===t||void 0===t?void 0:"true"===t?!0:"false"===t?!1:"null"===t?null:(e=parseFloat(t))==t?e:t}catch(n){}}function Q(t,e,n){for(var i=0,r=t.length;r>i;++i)if(e.call(n||null,t[i],i,t))return!0;return!1}function R(t){return"transform"==t&&(t=S.transform)||/^transform-?[Oo]rigin$/.test(t)&&(t=S.transform+"Origin")||"float"==t&&(t=S.cssFloat),t?D(t):null}function X(t,e,n,i){var r=0,o=e||this,l=[],s=W&&"string"==typeof t&&"<"!=t.charAt(0)?W(t):t;return z(F(s),function(t,e){z(o,function(i){n(t,l[r++]=e>0?_(o,i):i)},null,i)},this,i),o.length=r,z(l,function(t){o[--r]=t},null,!i),o}function Y(t,e,n){var i=tt(t),r=i.css("position"),o=i.offset(),l="relative",s=r==l,u=[parseInt(i.css("left"),10),parseInt(i.css("top"),10)];"static"==r&&(i.css("position",l),r=l),isNaN(u[0])&&(u[0]=s?0:t.offsetLeft),isNaN(u[1])&&(u[1]=s?0:t.offsetTop),null!=e&&(t.style.left=e-o.left+u[0]+T),null!=n&&(t.style.top=n-o.top+u[1]+T)}S.classList?(t=function(t,e){return t.classList.contains(e)},e=function(t,e){t.classList.add(e)},n=function(t,e){t.classList.remove(e)}):(t=function(t,e){return O(e).test(t.className)},e=function(t,e){t.className=A(t.className+" "+e)},n=function(t,e){t.className=A(t.className.replace(O(e)," "))});function j(t,e){return"function"==typeof e?e.call(t,t):e}function U(t,e,n){var r=this[0];return r?null==t&&null==e?(G(r)?J():{x:r.scrollLeft,y:r.scrollTop})[n]:(G(r)?i.scrollTo(t,e):(null!=t&&(r.scrollLeft=t),null!=e&&(r.scrollTop=e)),this):this}function Z(t){if(this.length=0,t){t="string"==typeof t||t.nodeType||"undefined"==typeof t.length?[t]:t,this.length=t.length;for(var e=0;e<t.length;e++)this[e]=t[e]}}Z.prototype={get:function(t){return this[t]||null},each:function(t,e){return z(this,t,e)},deepEach:function(t,e){return k(this,t,e)},map:function(t,e){var n,i,r=[];for(i=0;i<this.length;i++)n=t.call(this,this[i],i),e?e(n)&&r.push(n):r.push(n);return r},html:function(t,e){var n=e?void 0===o.textContent?"innerText":"textContent":"innerHTML",i=this,r=function(e,n){z(F(t,i,n),function(t){e.appendChild(t)})},l=function(i,o){try{if(e||"string"==typeof t&&!u.test(i.tagName))return i[n]=t}catch(l){}r(i,o)};return"undefined"!=typeof t?this.empty().each(l):this[0]?this[0][n]:""},text:function(t){return this.html(t,!0)},append:function(t){var e=this;return this.each(function(n,i){z(F(t,e,i),function(t){n.appendChild(t)})})},prepend:function(t){var e=this;return this.each(function(n,i){var r=n.firstChild;z(F(t,e,i),function(t){n.insertBefore(t,r)})})},appendTo:function(t,e){return X.call(this,t,e,function(t,e){t.appendChild(e)})},prependTo:function(t,e){return X.call(this,t,e,function(t,e){t.insertBefore(e,t.firstChild)},1)},before:function(t){var e=this;return this.each(function(n,i){z(F(t,e,i),function(t){n[l].insertBefore(t,n)})})},after:function(t){var e=this;return this.each(function(n,i){z(F(t,e,i),function(t){n[l].insertBefore(t,n.nextSibling)},null,1)})},insertBefore:function(t,e){return X.call(this,t,e,function(t,e){t[l].insertBefore(e,t)})},insertAfter:function(t,e){return X.call(this,t,e,function(t,e){var n=t.nextSibling;n?t[l].insertBefore(e,n):t[l].appendChild(e)},1)},replaceWith:function(t){return tt(this[0].parentNode.replaceChild(tt(F(t))[0],this[0]))},clone:function(t){var e,n,i=[];for(n=0,e=this.length;e>n;n++)i[n]=_(t||this,this[n]);return tt(i)},addClass:function(n){return n=H.call(n).split(L),this.each(function(i){z(n,function(n){n&&!t(i,j(i,n))&&e(i,j(i,n))})})},removeClass:function(e){return e=H.call(e).split(L),this.each(function(i){z(e,function(e){e&&t(i,j(i,e))&&n(i,j(i,e))})})},hasClass:function(e){return e=H.call(e).split(L),Q(this,function(n){return Q(e,function(e){return e&&t(n,e)})})},toggleClass:function(i,r){return i=H.call(i).split(L),this.each(function(o){z(i,function(i){i&&("undefined"!=typeof r?r?!t(o,i)&&e(o,i):n(o,i):t(o,i)?n(o,i):e(o,i))})})},show:function(t){return t="string"==typeof t?t:"",this.each(function(e){e.style.display=t})},hide:function(){return this.each(function(t){t.style.display="none"})},toggle:function(t,e){return e="string"==typeof e?e:"","function"!=typeof t&&(t=null),this.each(function(n){n.style.display=n.offsetWidth||n.offsetHeight?"none":e,t&&t.call(n)})},first:function(){return tt(this.length?this[0]:[])},last:function(){return tt(this.length?this[this.length-1]:[])},next:function(){return this.related("nextSibling")},previous:function(){return this.related("previousSibling")},parent:function(){return this.related(l)},related:function(t){return tt(this.map(function(e){for(e=e[t];e&&1!==e.nodeType;)e=e[t];return e||0},function(t){return t}))},focus:function(){return this.length&&this[0].focus(),this},blur:function(){return this.length&&this[0].blur(),this},css:function(t,e){var n,o=t;if(void 0===e&&"string"==typeof t)return e=this[0],e?e===r||e===i?(n=e===r?tt.doc():tt.viewport(),"width"==t?n.width:"height"==t?n.height:""):(t=R(t))?B(e,t):null:null;"string"==typeof t&&(o={},o[t]=e),!S.opasity&&"opacity"in o&&(o.filter=null!=o.opacity&&""!==o.opacity?"alpha(opacity="+100*o.opacity+")":"",o.zoom=t.zoom||1,delete o.opacity);function l(t,e,n){for(var i in o)if(o.hasOwnProperty(i)){n=o[i],(e=R(i))&&b.test(n)&&!(e in $)&&(n+=T);try{t.style[e]=j(t,n)}catch(r){}}}return this.each(l)},offset:function(t,e){if(t&&"object"==typeof t&&("number"==typeof t.top||"number"==typeof t.left))return this.each(function(e){Y(e,t.left,t.top)});if("number"==typeof t||"number"==typeof e)return this.each(function(n){Y(n,t,e)});if(!this[0])return{top:0,left:0,height:0,width:0};var n=this[0],i=n.ownerDocument.documentElement,o=n.getBoundingClientRect(),l=J(),s=n.offsetWidth,u=n.offsetHeight,f=o.top+l.y-Math.max(0,i&&i.clientTop,r.body.clientTop),c=o.left+l.x-Math.max(0,i&&i.clientLeft,r.body.clientLeft);return{top:f,left:c,height:u,width:s}},dim:function(){if(!this.length)return{height:0,width:0};var t=this[0],e=9==t.nodeType&&t.documentElement,n=e||!t.style||t.offsetWidth||t.offsetHeight?null:function(e){var n={position:t.style.position||"",visibility:t.style.visibility||"",display:t.style.display||""};return e.first().css({position:"absolute",visibility:"hidden",display:"block"}),n}(this),i=e?Math.max(t.body.scrollWidth,t.body.offsetWidth,e.scrollWidth,e.offsetWidth,e.clientWidth):t.offsetWidth,r=e?Math.max(t.body.scrollHeight,t.body.offsetHeight,e.scrollHeight,e.offsetHeight,e.clientHeight):t.offsetHeight;return n&&this.first().css(n),{height:r,width:i}},attr:function(t,e){var n,i=this[0];if("string"!=typeof t&&!(t instanceof String)){for(n in t)t.hasOwnProperty(n)&&this.attr(n,t[n]);return this}return"undefined"==typeof e?i?s.test(t)?y.test(t)&&"string"==typeof i[t]?!0:i[t]:"href"!=t&&"src"!=t||!S.hrefExtended?i[C](t):i[C](t,2):null:this.each(function(n){s.test(t)?n[t]=j(n,e):n[w](t,j(n,e))})},removeAttr:function(t){return this.each(function(e){y.test(t)?e[t]=!1:e.removeAttribute(t)})},val:function(t){return"string"==typeof t||"number"==typeof t?this.attr("value",t):this.length?this[0].value:null},data:function(t,e){var n,i,r=this[0];return"undefined"==typeof e?r?(n=I(r),"undefined"==typeof t?(z(r.attributes,function(t){(i=(""+t.name).match(x))&&(n[D(i[1])]=q(t.value))}),n):("undefined"==typeof n[t]&&(n[t]=q(this.attr("data-"+P(t)))),n[t])):null:this.each(function(n){I(n)[t]=e})},remove:function(){return this.deepEach(V),this.detach()},empty:function(){return this.each(function(t){for(k(t.childNodes,V);t.firstChild;)t.removeChild(t.firstChild)})},detach:function(){return this.each(function(t){t[l]&&t[l].removeChild(t)})},scrollTop:function(t){return U.call(this,null,t,"y")},scrollLeft:function(t){return U.call(this,t,null,"x")}};function _(t,e){var n,i,r,o=e.cloneNode(!0);if(t.$&&"function"==typeof t.cloneEvents)for(t.$(o).cloneEvents(e),n=t.$(o).find("*"),i=t.$(e).find("*"),r=0;r<i.length;r++)t.$(n[r]).cloneEvents(i[r]);return o}function G(t){return t===i||/^(?:body|html)$/i.test(t.tagName)}function J(){return{x:i.pageXOffset||o.scrollLeft,y:i.pageYOffset||o.scrollTop}}function K(t){var e=document.createElement("script"),n=t.match(f);return e.src=n[1],e}function tt(t){return new Z(t)}return tt.setQueryEngine=function(t){W=t,delete tt.setQueryEngine},tt.aug=function(t,e){for(var n in t)t.hasOwnProperty(n)&&((e||Z.prototype)[n]=t[n])},tt.create=function(t){return"string"==typeof t&&""!==t?function(){if(f.test(t))return[K(t)];var e=t.match(/^\s*<([^\s>]+)/),n=r.createElement("div"),i=[],o=e?p[e[1].toLowerCase()]:null,s=o?o[2]+1:1,u=o&&o[3],c=l,a=S.autoTbody&&o&&"<table>"==o[0]&&!/<tbody/i.test(t);for(n.innerHTML=o?o[0]+t+o[1]:t;s--;)n=n.firstChild;u&&n&&1!==n.nodeType&&(n=n.nextSibling);do e&&1!=n.nodeType||a&&(!n.tagName||"TBODY"==n.tagName)||i.push(n);while(n=n.nextSibling);return z(i,function(t){t[c]&&t[c].removeChild(t)}),i}():M(t)?[t.cloneNode(!0)]:[]},tt.doc=function(){var t=tt.viewport();return{width:Math.max(r.body.scrollWidth,o.scrollWidth,t.width),height:Math.max(r.body.scrollHeight,o.scrollHeight,t.height)}},tt.firstChild=function(t){for(var e,n=t.childNodes,i=0,r=n&&n.length||0;r>i;i++)1===n[i].nodeType&&(e=n[r=i]);return e},tt.viewport=function(){return{width:g?o.clientWidth:i.innerWidth,height:g?o.clientHeight:i.innerHeight}},tt.isAncestor="compareDocumentPosition"in o?function(t,e){return 16==(16&t.compareDocumentPosition(e))}:"contains"in o?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e=e[l];)if(e===t)return!0;return!1},tt});
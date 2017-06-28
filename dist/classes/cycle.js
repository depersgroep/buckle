"use strict";function Cycle(t){var s=this;t&&(s.defaults={cycle:t.cycle?t.cycle:null,container:t.container?t.container:null,containerwidth:!!t.containerwidth&&t.containerwidth,slides:{collection:t.slides?t.slides:null,min:0,max:t.slidesLimit?t.slidesLimit:t.slides?t.slides.length:0,cur:t.initialSlide?t.initialSlide:0,step:t.step?t.step:1,slideWidth:t.slideWidth?t.slideWidth:0},callback:{onSlideChange:t.onSlideChange?t.onSlideChange:function(){}},settings:{nav:!!t.navigation&&t.navigation,navclasses:{navNext:t.next?t.next:".next",navPrevious:t.previous?t.previous:".previous"},numbers:!!t.numbers&&t.numbers,bullets:!!t.bullets&&t.bullets,bulletClass:t.bulletClass?t.bulletClass:".slider__bullet",autoplay:!!t.autoplay&&t.autoplay,timer:t.timer?t.timer:3e3,infinite:!!t.loop&&t.loop,animation:!!t.animation&&t.animation,_interval:null,loop:!!t.loop&&t.loop}});function e(){var t=0;s.defaults.slides.collection.each(function(){$(this).hasClass("active")&&(s.defaults.slides.cur=t),t+=1}),s.show(s.defaults.slides.cur),s.defaults.settings.nav&&i(),s.defaults.settings.bullets&&l(),s.defaults.settings.autoplay&&(s.defaults.settings._interval=window.setInterval(function(){s.showNext(!0)},s.defaults.settings.timer))}function i(){bean.on($(s.defaults.settings.navclasses.navNext,s.defaults.settings.nav)[0],"click",function(t){t.preventDefault(),s.showNext()}),bean.on($(s.defaults.settings.navclasses.navPrevious,s.defaults.settings.nav)[0],"click",function(t){t.preventDefault(),s.showPrevious()})}function l(){$(s.defaults.settings.bulletClass,s.defaults.settings.bullets).each(function(){var t=arguments[1];bean.on(this,"click",function(e){e.preventDefault(),s.stopAutoplay(),s.show(t)})})}return s.defaults&&s.defaults.cycle&&s.defaults.slides.max&&e(),s}Cycle.prototype.show=function(t,s){if(this.defaults){var e=!1,i=!!s&&s;if(""!==t&&(t>=0&&t<this.defaults.slides.max?e=!0:t<0?this.defaults.settings.infinite&&(e=!0,t=this.defaults.slides.max-this.defaults.slides.step):t>=this.defaults.slides.max&&this.defaults.settings.infinite&&(e=!0,t=0),e)){i||"slide"!==this.defaults.settings.animation||(i="left",t<this.defaults.slides.cur&&(i="right")),this.defaults.slides.cur=t;var l={container:this.defaults.container,containerwidth:this.defaults.containerwidth,slides:this.defaults.slides.collection,slideWidth:this.defaults.slides.slideWidth,slideNumber:this.defaults.slides.cur,slideMax:this.defaults.slides.max,slideStep:this.defaults.slides.step,animation:this.defaults.settings.animation,direction:i,bullets:this.defaults.settings.bullets,infinite:this.defaults.settings.infinite,navigation:this.defaults.settings.nav,loop:this.defaults.settings.loop};this.defaults.callback.onSlideChange.call(this,l)}}return this},Cycle.prototype.showNext=function(t){if(this.defaults){var s=0;this.stopAutoplay(t),this.defaults.settings.loop||this.defaults.slides.cur+2*this.defaults.slides.step<=this.defaults.slides.max?s=this.defaults.slides.cur+this.defaults.slides.step:(s=this.defaults.slides.cur+this.defaults.slides.max,s-=this.defaults.slides.cur+this.defaults.slides.step),this.show(s,"left")}return this},Cycle.prototype.showPrevious=function(t){if(this.defaults){var s=0;this.stopAutoplay(t),(this.defaults.settings.loop||this.defaults.slides.cur-this.defaults.slides.step>-1)&&(s=this.defaults.slides.cur-this.defaults.slides.step),this.show(s,"right")}return this},Cycle.prototype.startAutoplay=function(t){if(this.defaults){var s=this;this.isPlaying=!0,t=t||this.defaults.settings.timer,t&&!this.defaults.settings.autoplay&&(this.defaults.settings.autoplay=!0,this.defaults.settings._interval=window.setInterval(function(){s.showNext(!0)},this.defaults.settings.timer))}return this},Cycle.prototype.stopAutoplay=function(t){if(this.defaults&&(this.isPlaying=!1,!t&&this.defaults.settings.autoplay&&this.defaults.settings._interval)){var s=this.defaults.settings._interval;window.clearInterval(s),this.defaults.settings.autoplay=!1}return this},Cycle.prototype.destroy=function(){return this};
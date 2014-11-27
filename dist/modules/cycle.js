"use strict";function Cycle(args){function setupCycle(){var current=0;_this.defaults.slides.collection.each(function(){$(this).hasClass("active")&&(_this.defaults.slides.cur=current),current+=1}),_this.show(_this.defaults.slides.cur),_this.defaults.settings.nav&&navEvents(),_this.defaults.settings.bullets&&bulletEvents(),_this.defaults.settings.autoplay&&(_this.defaults.settings._interval=window.setInterval(function(){_this.showNext(!0)},_this.defaults.settings.timer))}function navEvents(){bean.on($(".next",_this.defaults.settings.nav)[0],"click",function(e){e.preventDefault(),_this.showNext()}),bean.on($(".previous",_this.defaults.settings.nav)[0],"click",function(e){e.preventDefault(),_this.showPrevious()})}function bulletEvents(){$(".slider__bullet",_this.defaults.settings.bullets).each(function(){var ind=arguments[1];bean.on(this,"click",function(e){e.preventDefault(),_this.stopAutoplay(),_this.show(ind)})})}var _this=this;return args&&(_this.defaults={cycle:args.cycle?args.cycle:null,container:args.container?args.container:null,containerwidth:args.containerwidth?args.containerwidth:!1,slides:{collection:args.slides?args.slides:null,min:0,max:args.slidesLimit?args.slidesLimit:args.slides?args.slides.length:0,cur:args.initialSlide?args.initialSlide:0,step:args.step?args.step:1,slideWidth:args.slideWidth?args.slideWidth:0},callback:{onSlideChange:args.onSlideChange?args.onSlideChange:function(){}},settings:{nav:args.navigation?args.navigation:!1,numbers:args.numbers?args.numbers:!1,bullets:args.bullets?args.bullets:!1,autoplay:args.autoplay?args.autoplay:!1,timer:args.timer?args.timer:3e3,infinite:args.loop?args.loop:!1,animation:args.animation?args.animation:!1,_interval:null,loop:args.loop?args.loop:!1}}),_this.defaults&&_this.defaults.cycle&&_this.defaults.slides.max&&setupCycle(),_this}Cycle.prototype.show=function(slideNumber,direction){if(this.defaults){var showSlide=!1,animDirection=direction?direction:!1;if(""!==slideNumber&&(slideNumber>=0&&slideNumber<this.defaults.slides.max?showSlide=!0:0>slideNumber?this.defaults.settings.infinite&&(showSlide=!0,slideNumber=this.defaults.slides.max-this.defaults.slides.step):slideNumber>=this.defaults.slides.max&&this.defaults.settings.infinite&&(showSlide=!0,slideNumber=0),showSlide)){animDirection||"slide"!==this.defaults.settings.animation||(animDirection="left",slideNumber<this.defaults.slides.cur&&(animDirection="right")),this.defaults.slides.cur=slideNumber;var args={container:this.defaults.container,containerwidth:this.defaults.containerwidth,slides:this.defaults.slides.collection,slideWidth:this.defaults.slides.slideWidth,slideNumber:this.defaults.slides.cur,slideMax:this.defaults.slides.max,slideStep:this.defaults.slides.step,animation:this.defaults.settings.animation,direction:animDirection,bullets:this.defaults.settings.bullets,infinite:this.defaults.settings.infinite,navigation:this.defaults.settings.nav};this.defaults.callback.onSlideChange.call(this,args)}}return this},Cycle.prototype.showNext=function(isAutoplay){if(this.defaults){var newPosition=0;this.stopAutoplay(isAutoplay),this.defaults.settings.loop||this.defaults.slides.cur+2*this.defaults.slides.step<=this.defaults.slides.max?newPosition=this.defaults.slides.cur+this.defaults.slides.step:(newPosition=this.defaults.slides.cur+this.defaults.slides.max,newPosition-=this.defaults.slides.cur+this.defaults.slides.step),this.show(newPosition,"left")}return this},Cycle.prototype.showPrevious=function(isAutoplay){if(this.defaults){var newPosition=0;this.stopAutoplay(isAutoplay),(this.defaults.settings.loop||this.defaults.slides.cur-this.defaults.slides.step>-1)&&(newPosition=this.defaults.slides.cur-this.defaults.slides.step),this.show(newPosition,"right")}return this},Cycle.prototype.startAutoplay=function(timer){if(this.defaults){var that=this;this.isPlaying=!0,timer=timer||this.defaults.settings.timer,timer&&!this.defaults.settings.autoplay&&(this.defaults.settings.autoplay=!0,this.defaults.settings._interval=window.setInterval(function(){that.showNext(!0)},this.defaults.settings.timer))}return this},Cycle.prototype.stopAutoplay=function(isAutoplay){if(this.defaults&&(this.isPlaying=!1,!isAutoplay&&this.defaults.settings.autoplay&&this.defaults.settings._interval)){var theTimer=this.defaults.settings._interval;window.clearInterval(theTimer),this.defaults.settings.autoplay=!1}return this},Cycle.prototype.destroy=function(){return this};
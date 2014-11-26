'use strict';
describe('Cycle Module', function() {

	it('should exist', function() {
		expect(new Cycle()).toBeDefined();
	});

	describe('Method access', function() {
	
		var test = null;
	
		beforeEach(function() {
	
			test = new Cycle();
	
		});
		
		afterEach(function(){
			test.destroy();
			test = null;
		});
	
		it('should have a show method', function() {
			expect(test.show()).toBeDefined();
		});
		
		it('should have a showPrevious method', function() {
			expect(test.showPrevious()).toBeDefined();
		});
		
		it('should have a showNext method', function() {
			expect(test.showNext()).toBeDefined();
		});
		
		it('should return the object when calling destroy', function(){
			expect(test.destroy()).toEqual(test);
		});
	
	});

	describe('Properties defaults', function(){
		
		var test = null;
	
		beforeEach(function() {
	
			test = new Cycle({
				unexisiting: true
			});
	
		});
		
		afterEach(function(){
			test.destroy();
			test = null;
		});
		
		it('should not have a cycle object', function(){
			expect(test.defaults.cycle).toBeNull();
		});
		it('should have a container object', function(){
			expect(test.defaults.container).toBeNull();
		});
		it('should have a slide collection object', function(){
			expect(test.defaults.slides.collection).toBeNull();
		});
		it('should have a min slide number', function(){
			expect(test.defaults.slides.min).toEqual(0);
		});
		it('should have a max slide number', function(){
			expect(test.defaults.slides.max).toEqual(0);
		});
		it('should have a cur slide number', function(){
			expect(test.defaults.slides.cur).toEqual(0);
		});
		it('should have a default slide step', function(){
			expect(test.defaults.slides.step).toEqual(1);
		});
		it('should not have a navigation object', function(){
			expect(test.defaults.settings.nav).toBeFalsy();
		});
		it('should not have a numbers object', function(){
			expect(test.defaults.settings.numbers).toBeFalsy();
		});
		it('should not have a bullets object', function(){
			expect(test.defaults.settings.bullets).toBeFalsy();
		});
		it('should not have an autoplay object', function(){
			expect(test.defaults.settings.autoplay).toBeFalsy();
		});
		it('should have a default timer from 3000ms', function(){
			expect(test.defaults.settings.timer).toEqual(3000);
		});
		it('should not be infinite', function(){
			expect(test.defaults.settings.infinite).toBeFalsy();
		});
		it('should not have an animation object', function(){
			expect(test.defaults.settings.animation).toBeFalsy();
		});
	});

	describe('Properties setters', function(){
		
		var test = null,
			cycle = null;
	
		beforeEach(function() {
	
			cycle = $('.cycle.slider');
	
			test = new Cycle({
				cycle: cycle, // dummy object
				container: $('.cycle__container', cycle), // dummy object
				slides: $('.cycle__slide', cycle), // dummy objects
				navigation: $('.slider__nav', cycle), // dummy object
				numbers: true,
				bullets: $('.bullets', cycle), // dummy object
				autoplay: false,
				timer: 4000,
				loop: true,
				animation: 'slide'
			});
	
		});
		
		afterEach(function(){
			test.destroy();
			test = null;
		});
		
		it('should have a cycle object', function(){
			expect(test.defaults.cycle).toBeDefined();
		});
		it('should have a container object', function(){
			expect(test.defaults.container).toBeDefined();
		});
		it('should have a slide collection object', function(){
			expect(test.defaults.slides.collection).toBeDefined();
		});
		it('should have a min slide number', function(){
			expect(test.defaults.slides.min).toEqual(0);
		});
		it('should have a max slide number', function(){
			expect(test.defaults.slides.max).toEqual(3);
		});

		it('should have a cur slide number', function(){
			expect(test.defaults.slides.cur).toEqual(0);
		});
		
		it('should have a default slide step', function(){
			expect(test.defaults.slides.step).toEqual(1);
		});
		it('should have a navigation object', function(){
			expect(test.defaults.settings.nav).toBeDefined();
		});
		it('should have a numbers object', function(){
			expect(test.defaults.settings.numbers).toBeTruthy();
		});
		it('should have a bullets object', function(){
			expect(test.defaults.settings.bullets).toBeDefined();
		});
		it('should not have an autoplay object', function(){
			expect(test.defaults.settings.autoplay).toBeFalsy();
		});
		it('should have an altered timer from 4000ms', function(){
			expect(test.defaults.settings.timer).toEqual(4000);
		});
		it('should be infinite', function(){
			expect(test.defaults.settings.infinite).toBeTruthy();
		});
		it('should have an animation object', function(){
			expect(test.defaults.settings.animation).toEqual('slide');
		});

	});
	
	
	describe('Slideshow behaviour', function(){
		
		describe('Basic infinite slideshow', function(){
			var test = null,
				cycle = null;
	
			beforeEach(function() {
	
				cycle = $('.cycle.slider');
	
				test = new Cycle({
						cycle: cycle,
						container: $('.cycle__container', cycle),
						slides: $('.cycle__slide', cycle),
						loop: true,
						animation: 'slide',
						autoplay: false,
						timer: 8000
					});
	
			});
		
			afterEach(function(){
				cycle = null;
				test.destroy();
				test = null;
			});
		
			it('should have a show method', function() {
				expect(test.show()).toBeDefined();
				expect(test.show(1)).toBeDefined();
			});
			
			it('should show the next slide when calling the showNext method', function(){
				expect(test.showNext()).toBeDefined();
				expect(test.defaults.slides.cur).toEqual(1);
			});
			
			it('should show the previous slide when calling the showPrevious method', function(){
				test.showNext();
				expect(test.showPrevious()).toBeDefined();
				expect(test.defaults.slides.cur).toEqual(0);
			});
			
			it('should show the last slide when calling the showPrevious method on the first slide', function(){
				test.showPrevious();
				expect(test.defaults.slides.cur).toEqual(2);
			});
			
			it('should show the first slide when calling the showNext method 3 times', function(){
				test.showNext();
				test.showNext();
				test.showNext();
				expect(test.defaults.slides.cur).toEqual(0);
			});
			
		});
		
		describe('Slideshow with nav', function(){
			var test = null,
				cycle = null;
	
			beforeEach(function() {
	
				jasmine.clock().install();
	
				cycle = $('.cycle.slider');
	
				test = new Cycle({
						cycle: cycle,
						container: $('.cycle__container', cycle),
						slides: $('.cycle__slide', cycle),
						loop: false,
						animation: 'slide',
						autoplay: true,
						timer: 1000,
						navigation: $('.slider__nav', cycle)
					});
	
			});
		
			afterEach(function(){
				
				jasmine.clock().uninstall();
				
				cycle = null;
				test.destroy();
				test = null;
			});
			
			it('should change the slide each second', function(){
				jasmine.clock().tick(1001);
				expect(test.defaults.slides.cur).toEqual(1);
			});
		
			it('should show the next slide when clicking the next button', function(){
				var next = $('.next', test.defaults.settings.nav)[0];
				bean.fire(next, 'click');
				expect(test.defaults.slides.cur).toEqual(1);
			});
			
		
			it('should show the previous slide when clicking the previous button', function(){
				test.showNext(); // 1
				test.showNext(); // 2
				var previous = $('.previous', test.defaults.settings.nav)[0];
				bean.fire(previous, 'click');
				expect(test.defaults.slides.cur).toEqual(1);
			});
			
			it('should show the first slide when we ask it to', function(){
				test.showNext(); // 1
				test.showNext(); // 2
				test.show(0);
				expect(test.defaults.slides.cur).toEqual(0);
			});
			
			
			
		});
		
		describe('Slideshow with bullets and no autoplay', function(){
			var test = null,
				cycle = null;
	
			beforeEach(function() {
	
				cycle = $('.cycle.slider');
	
				test = new Cycle({
						cycle: cycle,
						container: $('.cycle__container', cycle),
						slides: $('.cycle__slide', cycle),
						loop: false,
						animation: 'slide',
						autoplay: false,
						bullets: $('.bullets', cycle)
					});
	
			});
		
			afterEach(function(){
				
				cycle = null;
				test.destroy();
				test = null;
			});
		
			it('should show the slide according to the bullet', function(){
				var bullet = $('.slider__bullet', test.defaults.settings.bullets)[2];
				bean.fire(bullet, 'click');
				expect(test.defaults.slides.cur).toEqual(2);
			});

		});
		
		describe('Slideshow with bullets and autoplay', function(){
			var test = null,
				cycle = null;
	
			beforeEach(function() {
	
				cycle = $('.cycle.slider');
	
				test = new Cycle({
						cycle: cycle,
						container: $('.cycle__container', cycle),
						slides: $('.cycle__slide', cycle),
						loop: false,
						animation: 'slide',
						autoplay: true,
						bullets: $('.bullets', cycle)
					});
	
			});
		
			afterEach(function(){
				
				cycle = null;
				test.destroy();
				test = null;
			});
		
			it('should show the slide according to the bullet and stop the autoplay', function(){
				var bullet = $('.slider__bullet', test.defaults.settings.bullets)[2];
				bean.fire(bullet, 'click');
				expect(test.defaults.slides.cur).toEqual(2);
				expect(test.defaults.autoplay).toBeFalsy();
			});

		});

	});

});

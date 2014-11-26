'use strict';
describe('Dialog Module', function() {

	it('should exist', function() {
		expect(new Dialog()).toBeDefined();
	});

	describe('Method access', function() {
	
		var test = null;
	
		beforeEach(function() {
	
			test = new Dialog();
	
		});
		
		afterEach(function(){
			test.destroy();
		});
	
		it('should have a show method', function() {
			expect(test.show(null)).toBeDefined();
		});
		
		it('should return the object when calling show', function(){
			expect(test.show(null)).toEqual(test);
		});
			
		it('should have a hide method', function() {
			expect(test.hide()).toBeDefined();
		});
		
		it('should return the object when calling hide', function(){
			expect(test.hide()).toEqual(test);
		});
			
		it('should have a destroy method', function() {
			expect(test.hide()).toBeDefined();
		});
		
		it('should return the object when calling destroy', function(){
			expect(test.destroy()).toEqual(test);
		});
	
	});
	
	describe('Dialog functionality', function(){
		
		describe('just a trigger and a modal', function(){
			
			var test = null,
				trig = null;
	
			beforeEach(function() {
	
				trig = document.createElement('div');
				
				trig.setAttribute('data-trigger', 'fauxmodal');
	
				test = new Dialog({
					trigger: trig
				});
	
			});
		
			afterEach(function(){
				
				trig = null;
				test.destroy();
				
			});
			
			it('should have a toggle attribute', function(){
				expect($(trig).data('toggle')).toBeDefined();
			});
			
			it('should call the show function when clicked', function(){
				spyOn(test, 'show').and.callThrough();
				bean.fire(trig, 'click');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});

		});
		
		describe('just a trigger, a modal and a closer', function(){
			
			var test = null,
				trig = null;
	
			beforeEach(function() {
	
				trig = document.createElement('div');
				
				trig.setAttribute('data-trigger', 'fauxmodal');
	
				test = new Dialog({
					trigger: trig,
					close: '.close'
				});
	
			});
		
			afterEach(function(){
				
				trig = null;
				test.destroy();
			});
			
			it('should have a toggle attribute', function(){
				expect($(trig).data('toggle')).toBeDefined();
			});
			
			it('should call the show function when clicked', function(){
				spyOn(test, 'show').and.callThrough();
				bean.fire(trig, 'click');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});

			it('should call the hide function when the closer is clicked', function(){
				spyOn(test, 'hide').and.callThrough();
				bean.fire(trig, 'click');
				bean.fire($('div[data-modal="fauxmodal"] .close')[0], 'click');
				expect(test.hide).toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(1);
			});

		});
		
	});

});

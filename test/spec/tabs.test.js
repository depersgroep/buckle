'use strict';
describe('Tab Module', function() {

	it('should exist', function() {
		expect(new Tabs()).toBeDefined();
	});
	
	describe('Method access', function() {
	
		var test = null;
	
		beforeEach(function() {
	
			test = new Tabs();
	
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

	describe('Tab functionality', function(){

		describe('Withou WAI-ARIA attributes', function(){
			
			var test = null,
				fauxTab = document.createElement('div');
			
			beforeEach(function() {
				
				test = new Tabs({
					tabs: fauxTab
				});
				
			});
			
			afterEach(function() {
				
				test.destroy();
				
			});
			
			it ('should be no toggle attribute', function(){
				expect($(fauxTab).data('toggle')).not.toBeDefined();
			});
			
		});

		describe('Click functionality', function(){
		
			var test = null,
				fauxTab = null;
			
			beforeEach(function() {
				
				fauxTab = document.createElement('div');
				fauxTab.setAttribute('aria-controls', 'fauxpane');
				
				test = new Tabs({
					tabs: fauxTab
				});
				
			});
			
			afterEach(function() {
				
				fauxTab = null;
				test.destroy();
				
			});
			
			it('should have a toggle attribute', function(){
				expect($(fauxTab).data('toggle')).toBeDefined();
			});
			
			it('should call the tab show function when clicked', function(){
				spyOn(test, 'show').and.callThrough();
				bean.fire(fauxTab, 'click');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});
			
			it('should call the hide function on all tabs when clicked', function(){
				spyOn(test, 'hide').and.callThrough();
				bean.fire(fauxTab, 'click');
				expect(test.hide).toHaveBeenCalled();
			});
			
		});

	});
	

	describe('Callback functionality', function(){
		
		var test = null,
			fauxTab = null,
			tabChange = jasmine.createSpy('tabChange');
	
		beforeEach(function(){
		
			fauxTab = document.createElement('div');
			fauxTab.setAttribute('aria-controls', 'fauxpane');
			
			test = new Tabs({
				tabs: fauxTab,
				onTabChange: tabChange
			});

		});
	
		afterEach(function(){
			fauxTab = null;
			test.destroy();
		});
		
		it('should call the callback function', function(){
			bean.fire(fauxTab, 'click');
			expect(tabChange).toHaveBeenCalled();
		});
		
	});


});

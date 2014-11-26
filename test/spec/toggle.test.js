'use strict';
describe('Toggle Module', function() {

	it('should exist', function() {
		expect(new Toggle({
			state: true
		})).toBeDefined();
	});


	describe('Method access', function() {

		var test = null;

		beforeEach(function() {

			test = new Toggle();

		});
		
		afterEach(function(){
			test.destroy();
		});

		it('should have a toggle method', function() {
			expect(test.toggle()).toBeDefined();
		});
		
		it('should return the object when calling toggle', function(){
			expect(test.toggle()).toEqual(test);
		});

		it('should have a show method', function() {
			expect(test.show()).toBeDefined();
		});
		
		it('should return the object when calling show', function(){
			expect(test.show()).toEqual(test);
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
	
	describe('Toggle functionality', function(){
		
		describe('click action with toggleclick', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig
				});
			
			});
		
			afterEach(function(){
				test.destroy();
			});
		
			it('should call the toggle function once when clicking the trigger', function(){
				spyOn(test, 'toggle');
				bean.fire(trig, 'click');
				expect(test.toggle).toHaveBeenCalled();
				expect(test.toggle.calls.count()).toEqual(1);
			});
		
			it('should call the show function once when clicking the trigger', function(){
				spyOn(test, 'show');
				bean.fire(trig, 'click');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});
		
			it('should update the state to true when clicking the trigger', function(){
				bean.fire(trig, 'click');
				expect(test.defaults.state).toBeTruthy();
			});
		
			it('should call the hide function once when clicking the trigger', function(){
				bean.fire(trig, 'click');
				spyOn(test, 'hide');
				bean.fire(trig, 'click');
				expect(test.hide).toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(1);
			});
		
			it('should update the state to false when clicking the trigger', function(){
				bean.fire(trig, 'click');
				bean.fire(trig, 'click');
				expect(test.defaults.state).toBeFalsy();
			});
			
		});

		describe('click action without toggleclick', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig,
					toggleClick: false
				});
			
			});
		
			afterEach(function(){
				test.destroy();
			});
		
			it('should call the toggle function once when clicking the trigger', function(){
				spyOn(test, 'toggle');
				bean.fire(trig, 'click');
				expect(test.toggle).toHaveBeenCalled();
				expect(test.toggle.calls.count()).toEqual(1);
			});
		
			it('should call the show function once when clicking the trigger', function(){
				spyOn(test, 'show');
				bean.fire(trig, 'click');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});
		
			it('should update the state to true when clicking the trigger', function(){
				bean.fire(trig, 'click');
				expect(test.defaults.state).toBeTruthy();
			});
		
			it('should not call the hide function once when clicking the trigger', function(){
				bean.fire(trig, 'click');
				spyOn(test, 'hide');
				bean.fire(trig, 'click');
				expect(test.hide).not.toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(0);
			});
		
			it('should not update the state to false when clicking the trigger', function(){
				bean.fire(trig, 'click'); // show
				bean.fire(trig, 'click'); // hide
				expect(test.defaults.state).toBeTruthy();
			});
			
		});
		
		describe('hover action with toggleclick', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig,
					mouseEvent: 'hover'
				});
			
			});
		
			afterEach(function(){
				test.destroy();
			});
		
			it('should call the toggle function once when hovering the trigger', function(){
				spyOn(test, 'toggle');
				bean.fire(trig, 'mouseover');
				expect(test.toggle).toHaveBeenCalled();
				expect(test.toggle.calls.count()).toEqual(1);
			});
		
			it('should call the show function once when hovering the trigger', function(){
				spyOn(test, 'show');
				bean.fire(trig, 'mouseover');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});
		
			it('should update the state to true when hovering the trigger', function(){
				bean.fire(trig, 'mouseover');
				expect(test.defaults.state).toBeTruthy();
			});
		
			it('should call the hide function once when the cursor leaves the trigger', function(){
				bean.fire(trig, 'mouseover');
				spyOn(test, 'hide');
				bean.fire(trig, 'mouseout');
				expect(test.hide).toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(1);
			});
		
			it('should update the state to false when the cursor leaves the trigger', function(){
				bean.fire(trig, 'mouseover');
				bean.fire(trig, 'mouseout');
				expect(test.defaults.state).toBeFalsy();
			});
			
		});
		
		describe('hover action without toggleclick', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig,
					mouseEvent: 'hover',
					toggleClick: false
				});
			
			});
		
			afterEach(function(){
				test.destroy();
			});
		
			it('should call the toggle function once when hovering the trigger', function(){
				spyOn(test, 'toggle');
				bean.fire(trig, 'mouseover');
				expect(test.toggle).toHaveBeenCalled();
				expect(test.toggle.calls.count()).toEqual(1);
			});
		
			it('should call the show function once when hovering the trigger', function(){
				spyOn(test, 'show');
				bean.fire(trig, 'mouseover');
				expect(test.show).toHaveBeenCalled();
				expect(test.show.calls.count()).toEqual(1);
			});
		
			it('should update the state to true when hovering the trigger', function(){
				bean.fire(trig, 'mouseover');
				expect(test.defaults.state).toBeTruthy();
			});
		
			it('should not call the hide function once when the cursor leaves the trigger', function(){
				bean.fire(trig, 'mouseover');
				spyOn(test, 'hide');
				bean.fire(trig, 'mouseout');
				expect(test.hide).not.toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(0);
			});
		
			it('should not update the state to false when the cursor leaves the trigger', function(){
				bean.fire(trig, 'mouseover');
				bean.fire(trig, 'mouseout');
				expect(test.defaults.state).toBeTruthy();
			});
			
		});
		
		/* MUST FIX _this object reference in phantomJS */

		xdescribe('Globalclose functionality', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig,
					state: true
				});
			
			});
		
			afterEach(function(){
				test.destroy();
			});
			
			it('should call the hide function when we click the document', function(){
				spyOn(test, 'hide');
				bean.fire(document, 'click');
				expect(test.hide).toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(1);
			});
		
			it('should update the state when we click the document', function(){
				bean.fire(document, 'click');
				expect(test.defaults.state).toBeFalsy();
			});
			
			it('should not call the hide function when we click inside the toggle', function(){
				spyOn(test, 'hide');
				var el = document.createElement('div');
				togg.appendChild(el);
				bean.fire(el, 'click');
				expect(test.hide).not.toHaveBeenCalled();
			});
		
			it('should not update the state when we click inside the toggle', function(){
				bean.fire(togg, 'click');
				expect(test.defaults.state).toBeTruthy();
			});
			
		});

		describe('No globalclose functionality', function(){
			
			var test = null,
				trig = null,
				togg = null;
		
			beforeEach(function(){
			
				trig = document.createElement('div');
				togg = document.createElement('div');
				test = new Toggle({
					toggle: togg,
					trigger: trig,
					globalClose: false,
					state: true
				});

			});
		
			afterEach(function(){
				test.destroy();
			});
			
			it('should not call the hide function when we click the document', function(){
				spyOn(test, 'hide');
				bean.fire(document, 'click');
				expect(test.hide).not.toHaveBeenCalled();
				expect(test.hide.calls.count()).toEqual(0);
			});
		
			it('should not update the state when we click the document', function(){
				bean.fire(document, 'click');
				expect(test.defaults.state).toBeTruthy();
				bean.fire(trig, 'click');
				expect(test.defaults.state).toBeFalsy();
			});
			
		});

	});
	
	describe('Callback functionality', function(){
		
		var test = null,
			trig = null,
			togg = null,
			togglen = jasmine.createSpy('togglen'),
			openen = jasmine.createSpy('openen'),
			sluiten = jasmine.createSpy('sluiten');
	
		beforeEach(function(){
		
			trig = document.createElement('div');
			togg = document.createElement('div');
			test = new Toggle({
				toggle: togg,
				trigger: trig,
				onShow: openen,
				onHide: sluiten,
				onToggle: togglen
			});

		});
	
		afterEach(function(){
			test.destroy();
		});
		
		it('should call the callback functions', function(){
			bean.fire(trig, 'click');
			expect(togglen).toHaveBeenCalled();
			expect(openen).toHaveBeenCalled();
			bean.fire(trig, 'click');
			expect(togglen).toHaveBeenCalled();
			expect(sluiten).toHaveBeenCalled();
		});
		
	});

});

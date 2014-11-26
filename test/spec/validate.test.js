'use strict';
describe('Validate Module', function() {

	it('should exist', function() {
		expect(new Validate({unexisting: null})).toBeDefined();
	});

	describe('Method access', function(){
	
		var test = null;
	
		beforeEach(function(){
			test = new Validate();
		});
		
		afterEach(function(){
			test = null;
		});
		
		it('should have a checkValidation method', function(){
			expect(test.checkValidation()).toBeDefined();
		});
		
		it('should have a checkValue method', function(){
			expect(test.checkValue()).toBeDefined();
		});
		
		it('should have a triggerError method', function(){
			expect(test.triggerError()).toBeDefined();
		});
		
		it('should have a removeError method', function(){
			expect(test.removeError()).toBeDefined();
		});
		
	});
	
	describe('Form validation', function(){
		
		describe('nothing filled in', function(){
			var test = null;
	
			beforeEach(function(){
				test = new Validate({
					frm: document.getElementById('testform')
				});
			});
		
			afterEach(function(){
				test = null;
			});
		
			it('should throw an error when we nothing is filled in', function(){
				expect(test.checkValidation()).toBeTruthy();
			});
		
		
			it('should throw an error when we submit the form', function(){
				spyOn(test, 'checkValidation');
				bean.fire(document.getElementById('testform'), 'submit');
				expect(test.checkValidation).toHaveBeenCalled();
			});
		});
		
		describe('everything filled in correct', function(){
			var test = null;
	
			beforeEach(function(){
				test = new Validate({
					frm: document.getElementById('testform')
				});
				
				document.getElementById('inpName').value = 'jochen';
				document.getElementById('inpNumber').value = '1234';
				document.getElementById('inpMinlength').value = 'testwaarde';
				document.getElementById('inpCheck').checked = 'checked';
				document.getElementById('inpEmail').value = 'test@gmail.com';
				document.getElementById('inpTel').value = '1234';
				document.getElementById('inpSelect').value = 'test';
				document.getElementById('inpText').value = 'dit is wat tekst';
				document.getElementById('inpRadioA').checked = 'checked';
				
			});
		
			afterEach(function(){
				test = null;
			});
		
			it('should not throw an error when we everything is filled in', function(){
				expect(test.checkValidation()).toBeFalsy();
			});
		
		
			it('should not throw an error when we submit the form', function(){
				spyOn(test, 'checkValidation');
				bean.fire(document.getElementById('testform'), 'submit');
				expect(test.checkValidation).toHaveBeenCalled();
				expect(document.getElementById('inpSubmit').disabled).toBeDefined();
				expect(document.getElementById('inpSubmit').disabled).toBeTruthy();
			});
		});
		
		describe('some things not filled in correct', function(){
			var test = null;
	
			beforeEach(function(){
				test = new Validate({
					frm: document.getElementById('testform')
				});
				
				document.getElementById('inpName').value = 'jochen';
				document.getElementById('inpNumber').value = '1234';
				document.getElementById('inpCheck').checked = 'checked';
				document.getElementById('inpMinlength').value = 'testwaarde'; // needs to be 3
				document.getElementById('inpEmail').value = 'test@gmail.com'; // needs to be an email
				document.getElementById('inpTel').value = '1234';
				document.getElementById('inpSelect').value = 'test';
				document.getElementById('inpText').value = 'dit is wat tekst';
				document.getElementById('inpRadioA').checked = 'checked';
				
			});
		
			afterEach(function(){
				test = null;
			});
			
			it('should throw an error when a number is not a number', function(){
				document.getElementById('inpNumber').value = 'nummer'; // needs to be an email
				expect(test.checkValidation()).toBeTruthy();
			});
		
			it('should throw an error when the email is invalid', function(){
				document.getElementById('inpEmail').value = 'testmail.com'; // needs to be an email
				expect(test.checkValidation()).toBeTruthy();
			});
			
			it('should throw an error when a required checkbox is unchecked', function(){
				document.getElementById('inpCheck').checked = '';
				expect(test.checkValidation()).toBeTruthy();
			});
			
			it('should throw an error when a required radio is unchecked', function(){
				document.getElementById('inpRadioA').checked = '';
				expect(test.checkValidation()).toBeTruthy();
			});

			it('should throw an error when the length is too short', function(){
				document.getElementById('inpMinlength').value = 'a'; // needs to be 3
				expect(test.checkValidation()).toBeTruthy();
			});

		});
		
		describe('keypress events', function(){
			var test = null;
	
			beforeEach(function(){
				test = new Validate({
					frm: document.getElementById('testform')
				});
				
				document.getElementById('inpName').value = 'jochen';
				document.getElementById('inpNumber').value = '1234';
				document.getElementById('inpCheck').checked = 'checked';
				document.getElementById('inpMinlength').value = 'a'; // needs to be 3
				document.getElementById('inpEmail').value = 'test@gmail.com'; // needs to be an email
				document.getElementById('inpTel').value = '1234';
				document.getElementById('inpSelect').value = 'test';
				document.getElementById('inpText').value = 'dit is wat tekst';
				document.getElementById('inpRadioA').checked = 'checked';
				
			});
		
			afterEach(function(){
				test = null;
			});
			
			it('should throw an error when the value is too short', function(){
				expect(test.checkValidation()).toBeTruthy();
			});

			it('should throw an error when we type 1 extra letter', function(){
				test.checkValidation();
				spyOn(test, 'checkValidation').and.callThrough();
				var inp = document.getElementById('inpMinlength');
				inp.value = 'ab'; // needs to be 3
				bean.fire(inp, 'keyup');
				expect(test.checkValidation).toHaveBeenCalled();
				expect(test.checkValidation()).toBeTruthy();
			});

		});
		
		describe('custom field validation', function(){
			var test = null;
			
			beforeEach(function(){
				test = new Validate({
					frm: document.getElementById('testform')
				});
				
				document.getElementById('inpName').value = 'jochen';
				document.getElementById('inpNumber').value = '1234';
				document.getElementById('inpCheck').checked = 'checked';
				document.getElementById('inpMinlength').value = 'a'; // needs to be 3
				document.getElementById('inpEmail').value = 'test@gmail.com'; // needs to be an email
				document.getElementById('inpTel').value = '1234';
				document.getElementById('inpSelect').value = 'test';
				document.getElementById('inpText').value = 'dit is wat tekst';
				document.getElementById('inpRadioA').checked = 'checked';
				
			});
		
			afterEach(function(){
				test = null;
			});
			
			it('should trigger an error if our field is empty', function(){
				spyOn(test, 'checkValidation').and.callThrough();
				test.triggerError.call(test, '#inpName', 'empty');
				bean.fire(document.getElementById('inpName'), 'keyup');
				expect(test.checkValidation).toHaveBeenCalled();
				expect(test.checkValidation()).toBeTruthy();
			});
			
			it('should trigger an error if our field is empty', function(){
				var nam = document.getElementById('inpName');
				nam.value = '';
				test.checkValidation();
				spyOn(test, 'removeError').and.callThrough();
				test.removeError.call(test, '#inpName');
				bean.fire(document.getElementById('inpName'), 'keyup');
				expect(test.removeError).toHaveBeenCalled();
				expect(test.removeError()).toBeTruthy();
			});
			
		});
		
	});

});

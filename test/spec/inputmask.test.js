'use strict';
describe('Inputmask Module', function() {

	it('should exist', function() {
		expect(new Inputmask()).toBeDefined();
	});

	describe('Method access', function() {

		var test = null;

		beforeEach(function() {

			test = new Inputmask();

		});

		afterEach(function(){
			test.destroy();
			test = null;
		});

		it('should return the object when calling destroy', function(){
			expect(test.destroy()).toEqual(test);
		});

	});

	describe('Properties defaults', function(){

		var test = null;

		beforeEach(function() {

			test = new Inputmask({
				unexisiting: true
			});

		});

		afterEach(function(){
			test.destroy();
			test = null;
		});

		it('should not have an inputmask object', function(){
			expect(test.defaults.inputmask).toBeNull();
		});

		it('should not have a pattern string', function(){
			expect(test.defaults.pattern).toBeNull();
		});

		it('should not have a maskCharacter string', function(){
			expect(test.defaults.maskCharacter).toBeNull();
		});

		it('should not have a separatorCharacter string', function(){
			expect(test.defaults.separatorCharacter).toBeNull();
		});
	});

	describe('Properties setters', function(){

		var test = null,
			$input = null;

		beforeEach(function() {

			$input = $('input.inputmask');

			console.log($input);
			test = new Inputmask({
				'inputmask': $input[0], // dummy object
				'pattern': '__/__/____',
				'maskCharacter': '_',
				'separatorCharacter': '/'
			});

		});

		afterEach(function(){
			test.destroy();
			test = null;
		});

		it('should have an inputmask object', function(){
			expect(test.defaults.inputmask).toBeDefined();
		});

		it('should have a pattern __/__/____', function(){
			expect(test.defaults.pattern).toEqual('__/__/____');
		});

		it('should have a maskCharacter _', function(){
			expect(test.defaults.maskCharacter).toEqual('_');
		});

		it('should have a separatorCharacter /', function(){
			expect(test.defaults.separatorCharacter).toEqual('/');
		});
	});
});

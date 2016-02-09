'use strict';
describe('Autocomplete Module', function() {
    it('should exist', function() {
       expect(new Autocomplete()).toBeDefined();
    });

    describe('Method access', function() {
        var test = null;

        beforeEach(function() {
            test = new Autocomplete();
        });

        afterEach(function(){
            test.destroy();
            test = null;
        });
    });

    describe('Properties defaults', function() {
        var test = null;

        beforeEach(function() {
            test = new Autocomplete({
                'unexisiting': true
            });
        });

        afterEach(function(){
            test = null;
        });

        it('should not have an input', function(){
            expect(test.defaults.input).toBeNull();
        });

        it('should not have a form', function(){
            expect(test.defaults.form).toBeNull();
        });

        it('should not have a button', function(){
            expect(test.defaults.button).toBeNull();
        });

        it('should not have an itemElement', function(){
            expect(test.defaults.itemElement).toBeDefined();
        });

        it('should not have a activeClass', function(){
            expect(test.defaults.activeClass).toBeDefined();
        });

        it('should not have a minLength', function(){
            expect(test.defaults.minLength).toBeDefined();
        });

        it('should not have a url', function(){
            expect(test.defaults.url).toBeNull();
        });
    });

    describe('Properties setters', function() {
        var test = null;

        beforeEach(function() {
            test = new Autocomplete({
                'input': $('[data-autocomplete-url] input'),
                'appendTo': $('.fjs-autocomplete-list'),
                'url': '',
                'button': $('[data-autocomplete-url] button'),
            });
        });

        afterEach(function(){
            test = null;
        });

        it('should have an input', function() {
            expect(test.defaults.input).toBeDefined();
        });

        it('should have a form', function() {
            expect(test.defaults.form).toBeDefined();
        });

        it('should have a button', function() {
            expect(test.defaults.button).toBeDefined();
        });

        it('should have an itemElement', function() {
            expect(test.defaults.itemElement).toBeDefined();
        });

        it('should have a activeClass', function() {
            expect(test.defaults.activeClass).toBeDefined();
        });

        it('should have a minLength', function() {
            expect(test.defaults.minLength).toBeDefined();
        });

        it('should have a url', function() {
            expect(test.defaults.url).toBeDefined();
        });
    });
});
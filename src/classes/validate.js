'use strict';
/**
 *
 *	Validating forms like a boss! On submit it automatically
 *	validates the form with
 *
 *
 *	@class Validate
 *	@constructor
 *
 *
 *	@property {Bonzo} form The dom element form
 *	@property {Boolean} noFormevents Don't catch submit / reset events
 *
 *	@example
 *
 *		new Validate({
 *		frm: $('.form-to-validate'),
 *		noFormevents: false, 
 *	});
 *
 *
 */
function Validate(args){

	if (args){
		var _this = this;
		_this.defaults = {
				frm: (args.frm ? args.frm : false),
				fields: [],
				noFormevents: (args.noFormevents ? true : false)
			};

		if (_this.defaults.frm){

			_this.defaults.frm.setAttribute('novalidate', '');

			// get all the input / textarea stuff and check if it's required
			$('input[required], textarea[required], select[required]', _this.defaults.frm).each(function(){
				_this.defaults.fields.push({
					hasError: false,
					htmlObj: this
				});
			});

			if (!_this.defaults.noFormevents){
				// hijack the form submit
				bean.on(_this.defaults.frm, 'submit', function(e){
					if (_this.checkValidation()){
						e.preventDefault();
					}else{
						$('[type="submit"]', this).attr('disabled', 'disabled');
					}
				});
				bean.on(_this.defaults.frm, 'reset', function(){
					_this.removeAllErrors();
				});
			}
		}
	}

	return this;

}

/**
 *
 *	@method checkValidation
 *	@for Validate
 *
 *	@description
 *	check the form validation
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	});
 *	theForm.checkValidation();
 *
 *
 */
Validate.prototype.checkValidation = function(){

	var error = false;
	
	// private function to check Regex
	function validateRegex(pattern) {
		var parts = pattern.split('/'),
			regex = pattern,
			options = "";
		if (parts.length > 1) {
			regex = parts[1];
			options = parts[2];
		}
		
		try {
			new RegExp(regex, options);
			return true;
		}
		catch(e) {
				return false;
		}
	}
	
	if (this.defaults){
		for(var k in this.defaults.fields){
			//IE looping over every arg protection
			if(!this.defaults.fields[k] || !this.defaults.fields[k].htmlObj) {
				continue;
			}
			this.removeError(k);
			// check if there is a value
			if (this.checkValue(this.defaults.fields[k].htmlObj)){
				// check the type
				switch (this.defaults.fields[k].htmlObj.nodeName.toLowerCase()){
				case 'textarea':
					// check if we have a data-regex, if so check if it is valid
					if (this.defaults.fields[k].htmlObj.getAttribute('data-regex') && validateRegex(this.defaults.fields[k].htmlObj.getAttribute('data-regex'))){
						var regexp = new RegEx(this.defaults.fields[k].htmlObj.getAttribute('data-regex'));
						if (regexp.test(this.defaults.fields[k].htmlObj.value)){
							this.triggerError(k, 'invalid');
							error = true;
						}
					}
					break;
				case 'select':
					if (!this.defaults.fields[k].htmlObj.options[this.defaults.fields[k].htmlObj.selectedIndex].value){
						this.triggerError(k, 'invalid');
						error = true;
					}
					break;
				default:
					switch(this.defaults.fields[k].htmlObj.getAttribute('type')){
					case 'checkbox':
						if (!this.defaults.fields[k].htmlObj.checked){
							this.triggerError(k, 'unchecked');
							error = true;
						}else{
							bean.off(this);
						}
						break;
					case 'radio':
						var radiogroup = $('input[name="' + this.defaults.fields[k].htmlObj.name + '"]:checked');
						if (radiogroup.length < 1 || !radiogroup[0].value){
							this.triggerError(k, 'unchecked');
							error = true;
						}
						break;
					case 'tel':
						// must be regex
						if (!/^\d+(\.\d+)*$/.test(this.defaults.fields[k].htmlObj.value)){
							this.triggerError(k, 'invalidTelephone');
							error = true;
						}
						break;
					case 'email':
						// new regex by Sven
						if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.defaults.fields[k].htmlObj.value)){
							this.triggerError(k, 'invalidEmail');
							error = true;
						}
						break;
					default:
						// check if we have a data-regex, if so check if it is valid
						if (this.defaults.fields[k].htmlObj.getAttribute('data-regex') && validateRegex(this.defaults.fields[k].htmlObj.getAttribute('data-regex'))){
							var regexp = new RegEx(this.defaults.fields[k].htmlObj.getAttribute('data-regex'));
							if (regexp.test(this.defaults.fields[k].htmlObj.value)){
								this.triggerError(k, 'invalid');
								error = true;
							}
						}
					}
				}
			}else{
				this.triggerError(k, 'empty');
				error = true;
			}
		}

		Arbiter.publish('/validate/complete', {
			error: error,
			validate: this,
			frm: this.defaults.frm
		});
	}
	return error;

};

/**
 *
 *	@method checkValue
 *	@for Validate
 *
 *	@description
 *	check if an input / textarea value is valid
 *
 *	@return {boolean} validation
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	}),
 *	inp = document.getElementById('inputName');
 *	theForm.checkValue(inp);
 *
 *
 */
Validate.prototype.checkValue = function(htmlObj){

	var r = false;
	if (htmlObj){
		if (htmlObj.value && htmlObj.value !== htmlObj.getAttribute('placeholder')){
			if (htmlObj.getAttribute('minlength')){
				if (htmlObj.value.length >= parseInt(htmlObj.getAttribute('minlength'), 10)){
					r = true;
				}
			}else{
				r = true;
			}
		}
	}

	return r;

};

// this is not a public function
Validate.prototype.triggerError = function(field, msg){

	if ((field || field === 0) && msg){
		var _this = this;

		if('number' !== typeof field && !this.defaults.fields[field]) {
			if('string' === typeof field) {
				field = $(field, _this.defaults.frm);
			}
			for(var i = 0; i < this.defaults.fields.length; i++) {
				if(field[0] === this.defaults.fields[i].htmlObj) {
					field = i;
					break;
				}
			}
		}

		this.defaults.fields[field].hasError = true;
		// only attch the event once!
		bean.off(_this.defaults.fields[field].htmlObj, 'keyup.validate');
		bean.on(_this.defaults.fields[field].htmlObj, 'keyup.validate', function(){
			_this.checkValidation();
		});

		Arbiter.publish('/validate/error/show', {
			field: this.defaults.fields[field].htmlObj,
			message: App.config.formErrors[msg]
		});
	}

	return this;


};

// neither is this
Validate.prototype.removeError = function(field){

	if (field){
		if('number' !== typeof field && !this.defaults.fields[field]) {
			if('string' === typeof field) {
				field = $(field, this.defaults.frm);
			}
			for(var i = 0; i < this.defaults.fields.length; i++) {
				if(field[0] === this.defaults.fields[i].htmlObj) {
					field = i;
					break;
				}
			}
		}

		Arbiter.publish('/validate/error/remove', {
			field: this.defaults.fields[field].htmlObj
		});
	}

	return this;

};

/**
 *
 *	@method removeAllErrors
 *	@for Validate
 *
 *	@description
 *	Remove all errors
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	});
 *	theForm.removeAllErrors();
 *
 *
 */
Validate.prototype.removeAllErrors = function() {
	for(var k in this.defaults.fields) {
		if(!this.defaults.fields[k] || !this.defaults.fields[k].htmlObj) {
			continue;
		}
		bean.off(this.defaults.fields[k].htmlObj, 'keyup.validate');
		this.removeError(k);
	}
};

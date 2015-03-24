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
  *	@property {function} [onError] callback function a input field has an error
 *	@property {function} [onRemoveError] callback function when an input field has no error and you should remove excisting errors
 *	@property {function} [onValidationComplete] callback function when all input fields are checked
 *
 *	@example
 *
 *		new Validate({
 *		frm: $('.form-to-validate'),
 *		noFormevents: false,
 *		onError: function(args) {
 *			// show error message somewhere
 * 		},
 * 		onRemoveError: function(args) {
 *			// remove errors
 *		},
 * 		onValidationComplete: function(args) {
 *			// all fields are checked, do... something
 * 		}
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
				noFormevents: (args.noFormevents ? true : false),
				i18n: {
					empty: (args.i18n && args.i18n.empty ? args.i18n.empty : 'This field is required.'),
					unchecked: (args.i18n && args.i18n.unchecked ? args.i18n.unchecked : 'This field is required.'),
					invalidEmail: (args.i18n && args.i18n.invalidEmail ? args.i18n.invalidEmail : 'Please enter a valid email address.'),
					invalidTelephone: (args.i18n && args.i18n.invalidTelephone ? args.i18n.invalidTelephone : 'Please enter a valid telephone number.')
				},
				onError: (args.onError ? args.onError : function(){}),
				onRemoveError: (args.onRemoveError ? args.onRemoveError : function(){}),
				onValidationComplete: (args.onValidationComplete ? args.onValidationComplete : function(){})
			};

		if (_this.defaults.frm){

			_this.defaults.frm.setAttribute('novalidate', '');

			// get all the input / textarea stuff and check if it's required
			$('input[required], textarea[required], select[required], input[data-validate="true"], textarea[data-validate="true"], select[data-validate="true"]', _this.defaults.frm).each(function(){
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
	function validateAndReturnRegex(pattern) {
		// find last slash
		var last = pattern.lastIndexOf('/'),
			regex = pattern.substring(1, last),
			flags = pattern.substring(last + 1);

		try {
			new RegExp(regex, flags);
			return {
				'regex': regex,
				'flags': flags
			};
		}
		catch(e) {
			return {};
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
					if (this.defaults.fields[k].htmlObj.getAttribute('data-regex')){
						var regexData = validateAndReturnRegex(this.defaults.fields[k].htmlObj.getAttribute('data-regex'));
						if (regexData.regex){
							var regexp = new RegExp(regexData.regex, regexData.flags);
							if (!regexp.test(this.defaults.fields[k].htmlObj.value)){
								this.triggerError(k, 'invalid');
								error = true;
							}
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
						// added leading +-sign
						// added spaces and slashes to the regex
						if (!/^(\+?\d+)(\/?[\s\.]?\d+)*$/.test(this.defaults.fields[k].htmlObj.value)){
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
						if (this.defaults.fields[k].htmlObj.getAttribute('data-regex')){
							var regexData = validateAndReturnRegex(this.defaults.fields[k].htmlObj.getAttribute('data-regex'));
							if(regexData.regex){
								var regexp = new RegExp(regexData.regex, regexData.flags);
								if (!regexp.test(this.defaults.fields[k].htmlObj.value)){
									this.triggerError(k, 'invalid');
									error = true;
								}
							}
						}
					}
				}
			} else if (!this.defaults.fields[k].htmlObj.getAttribute('data-validate')) {
				this.triggerError(k, 'empty');
				error = true;
			}
		}

		this.defaults.onValidationComplete.call(this, {
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

		this.defaults.onError.call(this, {
			field: this.defaults.fields[field].htmlObj,
			message: this.defaults.i18n[msg]
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

		this.defaults.onRemoveError.call(this, {
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

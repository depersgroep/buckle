"use strict";function Validate(args){if(args){var _this=this;_this.defaults={frm:args.frm?args.frm:!1,fields:[]},_this.defaults.frm&&(_this.defaults.frm.setAttribute("novalidate",""),$("input[required], textarea[required], select[required]",_this.defaults.frm).each(function(){_this.defaults.fields.push({hasError:!1,htmlObj:this})}),bean.on(_this.defaults.frm,"submit",function(e){_this.checkValidation()?e.preventDefault():$('[type="submit"]',this).attr("disabled","disabled")}),bean.on(_this.defaults.frm,"reset",function(){_this.removeAllErrors()}))}return this}Validate.prototype.checkValidation=function(){var error=!1;if(this.defaults){for(var k in this.defaults.fields)if(this.defaults.fields[k]&&this.defaults.fields[k].htmlObj)if(this.removeError(k),this.checkValue(this.defaults.fields[k].htmlObj))switch(this.defaults.fields[k].htmlObj.nodeName.toLowerCase()){case"textarea":break;case"select":break;default:switch(this.defaults.fields[k].htmlObj.getAttribute("type")){case"checkbox":this.defaults.fields[k].htmlObj.checked?bean.off(this):(this.triggerError(k,"unchecked"),error=!0);break;case"radio":var radiogroup=$('input[name="'+this.defaults.fields[k].htmlObj.name+'"]:checked');(radiogroup.length<1||!radiogroup[0].value)&&(this.triggerError(k,"unchecked"),error=!0);break;case"tel":break;case"email":/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.defaults.fields[k].htmlObj.value)||(this.triggerError(k,"invalidEmail"),error=!0)}}else this.triggerError(k,"empty"),error=!0;Arbiter.publish("/validate/complete",{error:error,validate:this,frm:this.defaults.frm})}return error},Validate.prototype.checkValue=function(htmlObj){var r=!1;return htmlObj&&htmlObj.value&&htmlObj.value!==htmlObj.getAttribute("placeholder")&&(htmlObj.getAttribute("minlength")?htmlObj.value.length>=parseInt(htmlObj.getAttribute("minlength"),10)&&(r=!0):r=!0),r},Validate.prototype.triggerError=function(field,msg){if((field||0===field)&&msg){var _this=this;if("number"!=typeof field&&!this.defaults.fields[field]){"string"==typeof field&&(field=$(field,_this.defaults.frm));for(var i=0;i<this.defaults.fields.length;i++)if(field[0]===this.defaults.fields[i].htmlObj){field=i;break}}this.defaults.fields[field].hasError=!0,bean.off(_this.defaults.fields[field].htmlObj,"keyup.validate"),bean.on(_this.defaults.fields[field].htmlObj,"keyup.validate",function(){_this.checkValidation()}),Arbiter.publish("/validate/error/show",{field:this.defaults.fields[field].htmlObj,message:App.config.formErrors[msg]})}return this},Validate.prototype.removeError=function(field){if(field){if("number"!=typeof field&&!this.defaults.fields[field]){"string"==typeof field&&(field=$(field,this.defaults.frm));for(var i=0;i<this.defaults.fields.length;i++)if(field[0]===this.defaults.fields[i].htmlObj){field=i;break}}Arbiter.publish("/validate/error/remove",{field:this.defaults.fields[field].htmlObj})}return this},Validate.prototype.removeAllErrors=function(){for(var k in this.defaults.fields)this.defaults.fields[k]&&this.defaults.fields[k].htmlObj&&(bean.off(this.defaults.fields[k].htmlObj,"keyup.validate"),this.removeError(k))};
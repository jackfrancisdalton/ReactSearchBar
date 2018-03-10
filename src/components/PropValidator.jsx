import React from 'react';
import PropTypes from 'prop-types';

let SearchBarValidation = {

	// ======================== Mandatory Porperties
	
	searchQueryURLFormatter: function(props, propName, componentName) {
		let fn = props[propName];
		let isFunction = (typeof fn.prototype.constructor === 'function')
		let validVariableCount = (fn.prototype.constructor.length === 3)

		if(!fn.prototype) {
			throw new Error(propName + ' is a required property')
		}

		if(!isFunction) {
			return new Error(propName + ' must be a function');
		}

		if(!validVariableCount) {
			return new Error(propName + ' function must have the 3 arguments: RSB (typeof Object) searchQuery(typeof string), extraQueryOptions (typeof Anything)'); 
		}
	},

	resultMapper: function(props, propName, componentName) {
		let fn = props[propName];
		let isFunction = (typeof fn.prototype.constructor === 'function')
		let validVariableCount = (fn.prototype.constructor.length === 2)

		if(!fn.prototype) {
			throw new Error(propName + ' is a required property')
		}

		if(!isFunction) {
			return new Error(propName + ' must be a function');
		}

		if(!validVariableCount) {
			return new Error(propName + ' function must have 2 arguments: RSB (typeof Object), queryResultJSON (type of JSON)');
		}
	},
		
	// // ======================== Optional Porperties

	extraOptions: React.PropTypes.object,
	showImage: React.PropTypes.bool,
	circularImage: React.PropTypes.bool,
	maxResultsToDisplay: React.PropTypes.number,
	searchDelay: React.PropTypes.number,
	useNavLink: React.PropTypes.bool,
	errorMessage: React.PropTypes.string,
	
	searchButton: function(props, propName, componentName) {
		let obj = props[propName];

		if(obj.show) {
			if(obj.onButtonClick) {
				if(obj.onButtonClick.prototype.constructor.length !== 4) {
					return new Error("onButtonClick must have 4 arguments:  RSB (typeof Object), event (typeOf event), searchQuery (typeOf String), extraOptions (typeOf Object)")
				}
			}

			if(typeof(obj.show) !== "boolean") {
				return new Error("searchButton.show must be of type Boolean")
			}
		}
	},

	// // ======================== Custom Component Producers
	
	customSearchBarProducer: function(props, propName, componentName) {
		let fn = props[propName];

		if(fn) {
			let isFunction = (typeof fn.prototype.constructor === 'function')
		
			let validVariableCount = (fn.prototype.constructor.length === 5)
			if(!isFunction) {
				return new Error(propName + ' must be a function');
			}

			if(!validVariableCount) {
				return new Error(propName + ' function must have 5 arguments: RSB(typeOf Object), inputTextValue(typeOf String), onKeyDown(typeOf function), onFocus(typeOf function), onChange(typeOf function)');
			}
		}
	},

 	customResultsProducer: function(props, propName, componentName) {
		let fn = props[propName];

		if(fn) {
			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 3)

			if(!isFunction) {
				return new Error(propName + ' must be a function');
			}

			if(!validVariableCount) {
				return new Error(propName + ' function must have 3 arguments: RSB (typeOf Object), idx (typeOf Number), resultJsonItem (typeOf Object)');
			}
		}
 	},

 	customLoadingBarProducer: function(props, propName, componentName) {
		let fn = props[propName];

		if(fn) {
			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 1)

			if(!isFunction) {
				return new Error(propName + ' must be a function');
			}

			if(!validVariableCount) {
				return new Error(propName + ' function must have 1 argument: RSB(typeOf Object)');
			}
		}
 	},

 	customNoResultProducer: function(props, propName, componentName) {
 		let fn = props[propName];

 		if(fn) {		
 			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 1)

			if(!isFunction) {
				return new Error(propName + ' must be a function');
			}

			if(!validVariableCount) {
				return new Error(propName + ' function must have 1 argument: RSB(typeOf Object)');
			}
		}
 	},
}


export default SearchBarValidation
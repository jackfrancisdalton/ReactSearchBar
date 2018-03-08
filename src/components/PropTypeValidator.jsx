import React from 'react';
import PropTypes from 'prop-types';

let SearchBarValidation = {

	// Mandatory Porperties
	searchQueryURLFormatter: function(props, propName, componentName) {
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
			return new Error(propName + ' function must have the 2 arguments: searchQuery(typeof string), extraQueryOptions (typeof Anything)'); 
		}
	},
	resultMapper: function(props, propName, componentName) {
		let fn = props[propName];
		let isFunction = (typeof fn.prototype.constructor === 'function')
		let validVariableCount = (fn.prototype.constructor.length === 1)

		if(!fn.prototype) {
			throw new Error(propName + ' is a required property')
		}

		if(!isFunction) {
			return new Error(propName + ' must be a function');
		}

		if(!validVariableCount) {
			return new Error(propName + ' function must have the argument: queryResultJSON (type of JSON)');
		}
	},
		
	// Optional Properties
	customButtonProducer: function(props, propName, componentName) {
		let fn = props[propName];
		if(fn) {
			if(!React.isValidElement(fn())) {
				return new Error(propName + ' function should return a react component')
			}
		}
	},
	
	customLoadingBarProducer: function (props, propName, componentName) {
		let fn = props[propName];

		if(fn) {
			if(!React.isValidElement(fn())) {
				return new Error(propName + ' function should return a react component')
			}
		}
	},

	extraOptions: React.PropTypes.object,
	showImage: React.PropTypes.bool,
	circularImage: React.PropTypes.bool,
	maxResultsToDisplay: React.PropTypes.number,
	searchDelay: React.PropTypes.number,
	useNavLink: React.PropTypes.bool,
	errorMessage: React.PropTypes.string,
	customResultComponentProducer: function(props, propName, componentName) {
		let fn = props[propName];

		if(fn) {
			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 2)

			if(!isFunction) {
				return new Error(propName + ' must be a function');
			}

			if(!validVariableCount) {
				return new Error(propName + ' function must have the 2 arguments: idx (type of Number), resultJsonItem(type of JSON)');
			}

			if(React.isValidElement(fn())) {
				return new Error(propName + ' function should return a react component')
			}
		}
	}
}


export default SearchBarValidation
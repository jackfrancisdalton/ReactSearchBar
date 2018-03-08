import React from 'react'
import {
	NoResult,
	SearchResult,
	CustomSearchButton,
	CustomLoadingCircle,
	BasicSearchResult,
} from './ChildComponents.jsx'

// customButtonProducer={customButtonGenerator}
// customLoadingBarGenerator={customLoadingBarGenerator}
// customButtonGenerator={{ show: true, mapperFunction: function(){}, customButtonGenerator: customButtonGenerator }}


let mapperFunction = function(queryResultJSON) {
	let formattedObjects = [];
	
	queryResultJSON.forEach(function(item, idx) {
		let hasAnyFields = (Object.keys(item).length !== 0)
		let isObject = (item.constructor === Object)

		if(hasAnyFields && isObject) {
			let newObject = {};
			newObject.title = item.groupName;
			newObject.imageURL = item.imgURL;
			newObject.targetURL = item.targetURL;
			formattedObjects.push(newObject);
		}
	});

	return formattedObjects;
}

let queryFormat = function(searchQuery, extraQueryOptions) {
	let URLBase = 'http://www.localhost:3030/groups'
	return URLBase;
}

let customBoxGenerator = function(idx, resultJsonItem) {
	return(
		<BasicSearchResult
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}


let customButtonGenerator = function(searchTerm, extraOptions) {
	return(<CustomSearchButton />)
}

let onClickButton = function(event, searchTerm, extraOptions) {
	console.log(event)
	console.log("HIT")
}

let customLoadingBarGenerator = function() {
	return(<CustomLoadingCircle />)
}

export {
	mapperFunction,
	queryFormat,
	customBoxGenerator,
	customButtonGenerator,
	onClickButton,
	customLoadingBarGenerator
}
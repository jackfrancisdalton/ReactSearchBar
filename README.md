# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* 

## Properties

### Manditory Props
The following properties must be supplied when calling React Search Bar

#### queryURL
The base URL that will fire off when a search is entered, the returns a JSON of results

#### queryFormatFunction
A function that is given the selected item data as an arugment, and formats the query to be fired off based on that
```
let quertFormat = function(searchQuery, queryString, queryFormatOptions) {
	return queryString + "?searchTerm=" + searchQuery
}
```

#### resultMapFunction
A function that takes the returned result form the search query request. It is given the returned JSON from the request as its only argument.
```
let mapperFunction = function(queryReturn) {
	let formattedObjects = [];
	
	queryReturn.forEach(function(item, idx) {
		let newObject = {};
		newObject.title = item.myObjectField_A;
		newObject.imageURL = item.myObjectField_B;
		newObject.targetURL = item.myObjectField1_C; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}
```
If you are not using a custom result item layout, then your values are to be assigned to title, imageURL, targetURL


### Optional Props
The following properties are not required, but allow you to configure the component to meet your applications needs.

#### customresultDOM 
If you require a custom DOM for your display result you can pass your custom react component into this optional property 
If you pass a component the search bar will generate an intsance for each result and append three properties to your Component
* keyRef - integer value represents the index of the result
* isSelected - a boolean value that is true if the instance is the  currently highlighted, this can be used for applying css classes 
* onHoverSelect -  a pass function that should be applied to inform the React Search bar when this element is highlighted with a mouse, simply add "onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)" to your component

Mouse highlighting, keyboard navigation (including going to the targetURL on enter pressed) will be mapped for you

#### showImage
If you are using the built in result display this will toggle displaying an image

#### circleImage
If you are using the built in result display and `showImage` is true, this will style the image to be a circular image

#### resultsToDisplay 
This is an integer value that limits the number of results that should be shown

#### searchDelay 
To prevent needless search requests, searchDelay will determin how long after typing the searchbar will wait until firing the request

#### useNavLink 
If you are using ReactRouter, setting this value to true will use NavLink instead of an anchor tag

### Default Props
If no optional properties are supplied to the search component, the default values will be as follows:

```
default {
	useNavLink: false,
	circularImage: false,
	searchDelay: 100,
	resultsToDisplay: 6,
}
```

## Exposed Functions 
React Search Bar also exposes functions for integrating with your website.
* search - 
* clear box - clears the search box content, and removes the results drop down 
* set box value - sets the value of the search bar and instantly searches for results
* copy box content value - 
* return current selected data set - returns the data for the current list of results

# Support 

# Style
## Themes
## Custom Styles


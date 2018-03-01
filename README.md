# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* 

## Properties

### Manditory Props

#### queryurl
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

customresultDOM 
if you do not want the generic result, create a function with your own dom element
whatever you create we will appened the properties behind the scenes
- keyRef a unique identified for 
- isSelected (will be true on the currently selected result), use this however you want for styling 
- defaultOnClick (if called from an onclick will use the default
- onHoverSelect, method for telling the component which object is selected
	to add simply add the following line to onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}

properties like use circle, show image, use navlink


for thos using react router, and option for using NavLink for client side redirection is there

### Default Props

```
default {
	useNavLink: false,
	circularImage: false,
	searchDelay: 100,
	resultsToDisplay: 6,
}
```

## exposed functions 
should you want to call functions using your website functions are exposed
* search (for search button usage)
* clear box 
* set box value
* copy box content value
* return current selected data set

# Support 

# Style
## Themes
## Custom Styles


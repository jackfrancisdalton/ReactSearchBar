# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* 

## Properties

### Manditory Props
The following properties must be supplied when calling React Search Bar

| Property | Type | Descriptin |
| -------- | ---- | ---------- |
| searchQueryURL | String | This is the base URL your search query will target, eg "http://wwww.mysite.com/search" |
| queryFormatFunction | function(searchQuery, baseQueryURL, extraOptions) | This function is for formatting the structure of your search query before sending the request. It supplies the baseQueryURL, the searchQuery (string in the search box), and extraOptions. extraOptions is an argument that can be optionally passed into RSB to format the searchQuery |
| resultMapFunction | function(queryResult) | This function supplies the search query result as an argument, and maps it to a JSON object that is then passed to the result |
 

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


| Property | Type | Description |
| -------- | ---- | ----------- |
| extraOptions | Object | This object will be passed to your query format function. The intention is to allow external componenets to configure the search. For example if you create a filter box, you can pass a JSON object of { isFree: true }, and appened that value to the search query before it is fired |
| showImage | Boolean | If set to `true` the search results will display a square image on the far left
| circleImage | Boolean | If `showImage` is true, you can make the image a circle by setting this property to true
| maxResultsToDisplay | Integer | The maximum number of results displayed on search
| searchDelay | Integer | The period of time of inaction before a search query fires. As the box searches on type, this property prevents a search being fired for every letter entered, lowering the number of server requests.
| useNavLink | Boolean | If you are using ReactRouter thus require links to be `<NavLink>` instead of `<a>` tag set this variable to true.
| customresultDOM | function(idx, resultJsonItem) | If you do not want to use the default search result DOM, you can pass a function that returns a custom React Component to the RSB to use as the result DOM. |


#### customresultDOM 
If you have decided to use the customresultDOM property there are a few format requirements.

Firstly the function you pass must take the two following arguments:
* idx : The index of the item in the results list 
* resultJsonItem : The JSON object returned by the search query at the specified index

Secondly it is required that your function returns a React Component. For Example :

```
let customBoxGenerator = function(idx, resultJsonItem) {
	return(
		<CustomResultBox
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}
```

Thirdly RSB will append the following properties to your custom react component when it is passed in :
| Property | Type | Description |
| -------- | ---- | ----------- |
| keyRef | Integer | The index number of the result |
| isSelected | Boolean | This value returns true if the relevent result is currently selected |
| onHoverSelect | function | Call this function, passing the keyRef to inform RSB that the current item is to be set as the selected result. For example `onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}` will set the cursor to whichever element the mouse is currently over. Keyboard navigation will still work without this binding. |

An example of this component is as follows:
```
class CustomResultBox extends React.Component {
	render() {
		return(
			<a href={this.props.targetURL} 
			   onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
			   className={this.props.isSelected ? "selected" : ""}} >
				<div>{this.props.title}</div>
			</a>
		)
	}
}
```

Fourthly, if you are using a custom-result-box component then your resultMapFunction will have to change correspondingly to the properties of that componenet. The default result box uses the props: title, targetURL, imageURL. If for example your server returned a result with `name` and `DoB` properties, and your custom componenet had the properties `title`, `subtitle`, your mapper would look like this :
```
let mapperFunction = function(queryReturn) {
	let formattedObjects = [];
	
	queryReturn.forEach(function(item, idx) {
		let newObject = {};
		newObject.title = item.name;
		newObject.subtitle = item.DoB; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}

```

Once your custom react result box componenet, box generator are configured, keyboard binding, mouse binding and search result binding will all be handled by RSB. The only requirements on your end are to decide how to use the "isSelected" and "onHoverSelect(idx)" functions supplied to your custom-result-box React Componenet


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

# Complete Examples
## Generic Result DOM Implementation
```
// Function for mapping search query results
let resultMapperFunc = function(queryResultJSON) {
	let formattedObjects = [];
	
	queryResultJSON.forEach(function(item, idx) {
		let newObject = {};
		newObject.title = item.groupName;
		newObject.imageURL = item.imgURL;
		newObject.targetURL = item.targetURL; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}

// Function for formatting the search query before being sent to server
let searchQueryFormatter = function(searchQuery, queryString, extraQueryOptions) {
	return queryString + "?searchterm=" + queryString + "?isMale=" + {extraQueryOptions.onlyMales};
}

// Your React Application
class YourReactPageApp extends React.Component {
  render() {
    return (
      <div className='index'>
        <h1>Welcome to my great website</h1>
        <h2>Use our search bar to find what you need!</h2>
      	<SearchBar 
      		searchQueryURL={"http://www.mywebsite:3000/search-members"} 
  		 	resultMapFunction={mapperFunction}
  		 	queryFormatFunction={queryFormat}
  		 	extraQueryOptions={ {onlyMales: True} } />
      </div>
    );
  }
}
```

## Custom Result DOM Implementation
```
// Function for mapping search query results
let resultMapperFunc = function(queryResultJSON) {
	let formattedObjects = [];
	
	queryResultJSON.forEach(function(item, idx) {
		let newObject = {};
		newObject.title = item.groupName;
		newObject.imageURL = item.imgURL;
		newObject.targetURL = item.targetURL; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}

// Function for formatting the search query before being sent to server
let searchQueryFormatter = function(searchQuery, queryString, extraQueryOptions) {
	return queryString + "?searchterm=" + queryString + "?isMale=" + {extraQueryOptions.onlyMales};
}

// Function for creating custom result DOMs
let customResultDOMGenerator = function(idx, resultJsonItem) {
	return(
		<BasicSearchResult 
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}

// Your React Application
class YourReactPageApp extends React.Component {
  render() {
    return (
      <div className='index'>
        <h1>Welcome to my great website</h1>
        <h2>Use our search bar to find what you need!</h2>
      	<SearchBar 
      		searchQueryURL={"http://www.mywebsite:3000/search-members"} 
      		searchDelay={200} 
      		useNavLink={false} 
      		circleImage={false}
      		customResultDOMGenerator={customBoxGenerator}
  		 	resultMapFunction={mapperFunction}
  		 	extraOptions={ {onlyMales: True} }
  		 	queryFormatFunction={queryFormat}
  		 	queryFormatOptions={{ option1: true, option2: false }} />
      </div>
    );
  }
}
```

# Style
## Themes
## Custom Styles


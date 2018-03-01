# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* 

## Properties

### Manditory Props
The following properties must be supplied when using React Search Bar

| Property | Type | Descriptin |
| -------- | ---- | ---------- |
| searchQueryURL | String | The base URL your search query will target, eg "http://wwww.mysite.com/search" |
| searchQueryURLFormatter | function | Takes the searchQueryURL, searchQuery and extraOptions and returns the final query that will be requested  |
| resultMapper | function | Takes the returned JSON from the server, and maps values to keys corrisponding to a result instance |

#### searchQueryURLFormatter Implementation
The searchQueryURLFormatter function is required to take 3 arguments:
* searchQuery : the string value taken from the search box
* searchQueryURL : the searchQueryURL string value that is passed into the RSB as a prop
* extraQueryOptions : the optional prop passed into the RSB (this can be any object type) 

```
let searchQueryURLFormatter = function(searchQuery, searchQueryURL, extraQueryOptions) {
	return searchQueryURL + "?searchterm=" + searchQuery + "?isMale=" + {extraQueryOptions.onlyMales};
}
```
The value returned from this function will be used to fetch the relevent results from the server.

#### resultMapper Implementation
The resultMapper function is required to take 1 argument:
* qeuryResult : the JSON result returned from the server

```
let resultMapper = function(qeuryResult) {
	let formattedObjects = [];
	
	qeuryResult.forEach(function(item, idx) {
		let newObject = {};
		newObject.title = item.field_A;
		newObject.imageURL = item.field_B;
		newObject.targetURL = item.field_C; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}
	```
IMPORTANT: in this example the values are mapped to : title, imageURL, targetURL. If you are not using `customresultDOM` you must map to these values.


### Optional Props
The following properties are not required, but allow you to configure the component to meet your application's needs.

| Property | Type | Description |
| -------- | ---- | ----------- |
| extraOptions | Object | This object will be passed to your query format function. The intention is to allow external componenets to configure the search. For example if you create a filter box, you can pass a JSON object of { isFree: true }, and appened that value to the search query before it is fired |
| showImage | Boolean | If set to `true` the search results will display a square image on the far left
| circleImage | Boolean | If `showImage` is true, you can make the image a circle by setting this property to true
| maxResultsToDisplay | Integer | The maximum number of results displayed on search
| searchDelay | Integer | The period of time of inaction before a search query fires. As the box searches on type, this property prevents a search being fired for every letter entered, lowering the number of server requests.
| useNavLink | Boolean | If you are using ReactRouter thus require links to be `<NavLink>` instead of `<a>` tag set this variable to true.
| customResultComponentGenerator | function | If you do not want to use the in built result component , you can pass a function that returns your own React Component to the RSB to use as the result component instead. |


#### customResultComponentGenerator 
If you have decided to use the customResultComponentGenerator property there are a few format requirements.

Firstly the function is required to take the 2 following arguments:
* idx : The index of the item in the results list 
* resultJsonItem : The JSON object returned by the search query at the specified index

Secondly it is required that your function returns a React Component. For Example :

```
let customResultComponentGenerator = function(idx, resultJsonItem) {
	return(
		<CustomResultBox
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}
```

Thirdly RSB will append (and handle) the following properties to your custom react component :
| Property | Type | Description |
| -------- | ---- | ----------- |
| keyRef | Integer | The index number of the result |
| isSelected | Boolean | This value returns true if the relevent result is currently selected |
| onHoverSelect | function | Call this function, passing the keyRef to inform RSB that the current item is to be set as the selected result. (required for mouse selection, however keyboard navigation will work without) |

An example of a correctly configured custom result box component is as follows:
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

Fourthly, if you are using a custom-result-box component then your resultMapFunction will have to correspond to the properties of that componenet. The default result box uses the props: title, targetURL, imageURL. If for example your server returned a result with `name` and `DoB` properties, and your custom componenet had the properties `title`, `subtitle`, your mapper would look like this :
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

Once your custom-result-box componenet, and customResultComponentGenerator are configured, keyboard binding, mouse binding and search result binding will all be handled by RSB. The only requirements on your end, is to decide how to use the "isSelected" and "onHoverSelect(idx)" functions supplied to your custom-result-box React Componenet. For example isSelected can be used to add a class to the component when it is selected.


### Default Props
If no optional properties are supplied to the search component, the following default values will be assigned:

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

# Software Versions
# Security Concerns

# Style
## Themes
## Custom Styles


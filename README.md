# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* ReactRouter support

## Properties

### Manditory Props
The following properties must be supplied when implementing React Search Bar

| Property | Type | Descriptin |
| -------- | ---- | ---------- |
| **searchQueryURL** | *String* | The base URL your search query will target, eg "http://wwww.mysite.com/search" |
| **searchQueryURLFormatter** | *function* | returns the final string URL that is sent to the server to request search results  |
| **resultMapper** | *function* | Takes the returned JSON from the server, and returns an object with values mapped to property names corresponding to the result component |

#### searchQueryURLFormatter Implementation
The searchQueryURLFormatter function is required to take 3 arguments:
* searchQuery : the string value taken from the search box
* searchQueryURL : the searchQueryURL string value that is passed into the RSB as a prop
* extraQueryOptions : the optional prop passed into the RSB (this can be any object type) 

```javascript
let searchQueryURLFormatter = function(searchQuery, searchQueryURL, extraQueryOptions) {
	return searchQueryURL + "?searchterm=" + searchQuery + "?isMale=" + {extraQueryOptions.onlyMales};
}
```
The value returned from this function will be used to as the URL that fetches results from the server. There is no limitation on the structure of the returned string value.

#### resultMapper Implementation (always return an array even if no result)
The resultMapper function is required to take 1 argument:
* qeuryResult : the JSON result returned from the server

The values you wish to display must be mapped to:
* title : the main text displayed in the result 
* imageURL : the url of the image to be displayed in the result box
* targetURL : the url to be navigated to when the result is clicked/enter key is hit


```javascript
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
*IMPORTANT*: in this example the values are mapped to properties for the out-of-box result component. If you are using `customResultComponentGenerator` please see the explination [here](#### customResultComponentGenerator), for configuring resultMapper for custom result components.

### Optional Props
The following properties are not required, but allow you to configure the component to meet your application's needs.

| Property | Type | Description |
| -------- | ---- | ----------- |
| **extraQueryOptions** | *Any* | This object will be passed to your `searchQueryURLFormatter` function. The intention is to allow external componenets to configure the search. For example if you create a filter box, you can pass a JSON object of { isFree: true }, and appened that value to the search query before it is sent |
| **showImage** | *Boolean* | If set to `true` the search results will display a square image on the far left
| **circleImage** | *Boolean* | If `showImage` is true, you can make the image a circle by setting this property to true
| **maxResultsToDisplay** | *Integer* | The maximum number of results displayed on search
| **searchDelay** | *Integer* | The period of time of inaction before a search query fires. As the box searches on type, this property prevents a search being fired for every letter entered, lowering the number of server requests.
| **useNavLink** | *Boolean* | If you are using ReactRouter thus require links to be `<NavLink>` instead of `<a>` tag set this variable to true.
| **customResultComponentGenerator** | *function* | If you do not want to use the in built result component , you can pass a function that returns your own React Component to the RSB to use as the result component instead. |


#### customResultComponentGenerator 
If you have decided to use the `customResultComponentGenerator` property there are a few format requirements.

Firstly the function is required to take the 2 following arguments:
* idx : The index of the item in the results list 
* resultJsonItem : The JSON object returned by the search query at the specified index

Secondly it is required that your function returns a React Component. For Example :

```javascript
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
| *keyRef* | **Integer** | The index number of the result |
| *isSelected* | **Boolean** | This value returns true if the relevent result is currently selected |
| *onHoverSelect* | **function** | Call this function, passing the keyRef to inform RSB that the current item is to be set as the selected result. (required for mouse selection, however keyboard navigation will work without) |
| *onClick* | **function** | TO DOOOOOOOOOOOOO |


An example of a correctly configured custom result box component is as follows:
```javascript
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

Fourthly, if you are using a custom result box then your `resultMapFunction` will have to correspond to the properties for that componenet. If for example your server returned a result with `name` and `DoB` properties, and your custom componenet had the properties `title`, `subtitle`, your mapper would look like this :
```javascript
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

Once your custom result box componenet, and `customResultComponentGenerator` are configured; keyboard binding, mouse binding and search result binding will all be handled by RSB. The only requirements on your end, is to decide how to use the "isSelected" and "onHoverSelect(idx)" functions supplied to your custom result box componenet (For example isSelected can be used to add a class to the component when it is selected).


### Default Props
If no optional properties are supplied to the search component, the following default values will be assigned:

```javascript
default {
	useNavLink: false,
	showImage: false, 
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
## Out-of-Box Result Implementation
```javascript

let resultMapper = function(queryResultJSON) {
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

let searchQueryURLFormatter = function(searchQuery, searchQueryURL, extraQueryOptions) {
	return searchQueryURL + "?searchterm=" + searchQuery" + "?isMale=" + extraQueryOptions.isMale;
}

class YourApplication extends React.Component {
  render() {
    return (
      <div >
      	<h1>Welcome to my website!</h1>
      	<h2>Check out my facy search bar.</h2>
      	<SearchBar 
      		searchQueryURL={"http://www.yourwebsite.com/search"} 
  		 	resultMapper={resultMapper}
  		 	searchQueryURLFormatter={searchQueryURLFormatter}
  		 	extraQueryOptions={{ isMale: true, isEmployed: false }} />
      </div>
    );
  }
}
```

## Custom Result Implementation
```javascript

// Custom result box componenet that replaces the out-of-box result
class CustomResultBox extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<a href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}>
				<img src={this.props.profileImageURL} />
				<div className={this.props.isSelected ? " selected" : ""}>{this.props.personName}}</div>
				<div>{this.props.DoB}}</div>
			</a>
		)
	}
}

// Custom result generator that is passed to search bar
let customResultComponentGenerator = function(idx, resultJsonItem) {
	return(
		<CustomResultBox 
			personName={resultJsonItem.personName}
			subTitle={resultJsonItem.subTitle}
			targetURL={resultJsonItem.targetURL}
			profileImageURL={resultJsonItem.profileImageURL}} />
	)
}

let mapperFunction = function(queryResultJSON) {
	let formattedObjects = [];
	
	queryResultJSON.forEach(function(item, idx) {
		let newObject = {};
		newObject.personName = item.name;
		newObject.subTitle = item.DoB.toString();
		newObject.targetURL = item.targetURL;
		newObject.profileImageURL = item.imageURL; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}

let searchQueryURLFormatter = function(searchQuery, searchQueryURL, extraQueryOptions) {
	return searchQueryURL + "?searchterm=" + searchQuery" + "?isMale=" + extraQueryOptions.isMale;
}

class YourApplication extends React.Component {
  render() {
    return (
      <div >
      	<h1>Welcome to my website!</h1>
      	<h2>Check out my facy search bar.</h2>
      	<SearchBar 
      		searchQueryURL={"http://www.yourwebsite.com/search"} 
  		 	resultMapper={resultMapper}
  		 	searchQueryURLFormatter={searchQueryURLFormatter}
  		 	extraQueryOptions={{ isMale: true, isEmployed: false }} 
      		customResultComponentGenerator={customResultComponentGenerator} />
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


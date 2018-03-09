# React Search Bar
React Search Bar (RSB) is a customisable component that functions much like search bars you see on popular websites like Facebook and Twitter.

RSB aims to balance easy implementation with high levels of customisablity. To accomplish this aim, RSB features :
* An out-of-box solution for quick implementation in projects.
* Ability to tweak the functionality and styling to your application's needs.
* Componenet replacement that allows you to inject bespoke react componenets whilst taking advantage of the RSB functionality.


## Properties

### Manditory Props
The following properties must be passed as properties when implementing RSB

| Property | Type | Descriptin |
| -------- | ---- | ---------- |
| **searchQueryURLFormatter** | *function* | returns the final string URL that is sent to the server to request search results  |
| **resultMapper** | *function* | Takes the returned JSON from the server, and returns an object with values mapped to property names corresponding to the result component |

#### searchQueryURLFormatter Implementation
`searchQueryURLFormatter` function is supplied 3 arguments by RSB:
* RSB : `this` value from RSB, exposing all RSB fields
* searchQuery : the string value taken from the search box
* extraQueryOptions : the optional prop passed into the RSB (this can be any object type) 

```javascript
let searchQueryURLFormatter = function(RSB, searchQuery, extraQueryOptions) {
	return "http://www.myserver.com" 
			+ "?searchterm=" + searchQuery 
			+ "?isMale=" + {extraQueryOptions.onlyMales}
			+ "?numberToFetch=" + RSB.props.maxResultsToDisplay
}
```
The value returned from this function will be used to as the URL sent to fetch results from your server.

#### resultMapper Implementation (always return an array even if no result)
`resultMapper` function is supplied 2 arguments by RSB:
* RSB : `this` value from RSB, exposing all RSB fields
* qeuryResult : the response from your server from the request `searchQueryURLFormatter` generated

The values you wish to display *must* be mapped to:
* title : the main text displayed in a result instance 
* imageURL : the url of the image to be displayed in a result instance
* targetURL : the url to be navigated to when the result is clicked/enter key is hit


```javascript
let resultMapper = function(RSB, qeuryResult) {

	// Defines the array to be returned
	let formattedObjects = [];
	
	// Iterate through results and maps results 
	qeuryResult.forEach(function(result, idx) {
		let newObject = {};
		newObject.title = result.field_A;
		newObject.imageURL = result.field_B;
		newObject.targetURL = result.field_C; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}
```
*IMPORTANT*: In this example the values are mapped to properties for the out-of-box result component. If you are using `customResultsProducer` please see the explination [here](#### customResultComponentGenerator), for configuring resultMapper for a custom components.

### Optional Props
The following properties are not required, but allow you to configure the component to meet your application's needs.

| Property | Type | Description |
| -------- | ---- | ----------- |
| **extraOptions** | *Any* | This object will be passed to your `searchQueryURLFormatter` function. The intention is to allow external componenets to configure the search. For example if you create a filter box, you can pass a JSON object of { isFree: true }, and appened that value to the search query before it is sent |
| **showImage** | *Boolean* | If set to `true` the search results will display a square image on the far left
| **circleImage** | *Boolean* | If `showImage` is true, you can make the image a circle by setting this property to true
| **maxResultsToDisplay** | *Integer* | The maximum number of results displayed on search
| **searchDelay** | *Integer* | The period of time of inaction before a search query fires. As the box searches on type, this property prevents a search being fired for every letter entered, lowering the number of server requests.
| **useNavLink** | *Boolean* | If you are using ReactRouter thus require links to be `<NavLink>` instead of `<a>` tag set this variable to true.
| **noResultsMessage** | *String* | The message displayed when no result is returned from the server |
| **searchButton** | *object* | {show: Boolean, onClick: function} |

### Custom Componenets
If the out-of-box  implementation doesn't fit your needs RSB allows you replace componenets with your own bespoke React Componenets.
This can be done in a modular way, allowing you to leave in place componenets you wish to use, and replace those you do not.
Using custom components does come with some requirements, so be sure to read the detailed implementation details of any method you decide to use.

| Property | Type | Description |
| -------- | ---- | ----------- |
| **customSearchBarProducer** | *function* | Replaces the out-of-box "search bar" DOM with your own bespoke React component |
| **customResultsProducer** | *function* |  Replaces the out-of-box "result" DOM with your own bespoke React component |
| **customLoadingBarProducer** | *function* | Replaces the out-of-box "loading-spinner" DOM with your own bespoke React component |
| **customNoResultProducer** | *function* | Replaces the out-of-box "no results" DOM with your own bespoke React component |

#### customSearchBarProducer implementation
If you have decided to use the `customSearchBarProducer` property there are a few format requirements.

Firstly the `customResultsProducer` function is supplied 5 arguments by RSB:
* RSB : Exposes all internal values stored by RSB
* inputTextValue :  represents the value to be displayed in the search box
* onKeyDown : handles `onKeyDown` events on the search bar
* onFocus : handles `onFocus` events on the search bar
* onChange : handles `onChange` events on the search bar

Secondly you must bind these functions to your custom react componenet. All of this can be seen in the example below :

```javascript
//customResultsProducer to be passed into RSB
let customResultsProducer = function(RSB, inputTextValue, onKeyDown, onFocus, onChange) {
	return (
		<CustomSearchBar 
			searchValue={inputTextValue}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onChange={onChange}
		/>
	)
}

// Custom Search Bar
class CustomSearchBar extends React.Component {
	render() {
		return(
			<div>
				<form>
					<div>
						<input type='text'
							value={this.props.searchValue}
							onKeyDown={this.props.onKeyDown}
							onFocus={this.props.onFocus}
							onChange={this.props.onChange} />
					</div>
				</form>
			</div>
		)
	}
}
```

#### customResultsProducer implementation
If you have decided to use the `customResultsProducer` property there are a configuration requirements.

Firstly the `customResultsProducer` function is supplied 3 arguments by RSB:
* RSB : Exposes all internal values stored by RSB
* idx : The index of the item in the results set 
* resultJsonItem : The result at position `idx` from the returned server results

Secondly RSB will automatically append the following properties to your custom result component :

| Property | Type | Description |
| -------- | ---- | ----------- |
| *keyRef* | **Integer** | The index number of the result |
| *isSelected* | **Boolean** | This value returns true if the result is currently selected |
| *onHoverSelect* | **function** | Call this function, passing the keyRef to inform RSB that the current item is to be set as the selected result. (required for mouse selection, however keyboard navigation will work without) |

Thirdly, if you are using `customResultsProducer` then your `resultMapper` will have to correspond to the properties of that componenet. An example of a correctly configured custom result component is as follows:

```javascript
let customResultsProducer = function(RSB, idx, resultJsonItem) {
	return(
		<CustomResultBox
			title={resultJsonItem.title}
			subtitle={resultJsonItem.subtitle}
			targetURL={resultJsonItem.targetURL} />
	)
}

class CustomResultBox extends React.Component {
	render() {
		return(
			<a href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)} 
				className={this.props.isSelected ? "selected" : ""}}>
				<div>{this.props.title}</div>
				<div>{this.props.subtitle}</div>
			</a>
		)
	}
}

// Mapper function that corresponds to CustomResultBox props
let mapperFunction = function(queryReturn) {
	let formattedObjects = [];
	
	queryReturn.forEach(function(personResult, idx) {
		let newObject = {};
		newObject.title = personResult.name;
		newObject.subtitle = personResult.DoB; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}
```

#### customNoResultProducer 

```javascript
let customNoResultProducer = function(RSB) {
	return (<CustomNoResult />)
}

class CustomNoResult extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div>no resultass</div>
		)
	}
}

```

#### customLoadingBarProducer 

```javascript
let customLoadingBarGenerator = function(RSB) {
	return(<CustomLoadingCircle />)
}

class CustomLoadingCircle extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div>LOADING...</div>
		)
	}
}

```


### Default Props Values
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

# Versions
- react version
- react dom version
-  

# Complete Examples
## Out-of-Box Example
```javascript

let resultMapper = function(queryResultJSON) {
	let formattedObjects = [];
	
	if(!isEmptyObject(queryResultJSON)) {
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
	}

	return formattedObjects;
}

let searchQueryURLFormatter = function(RSB, searchQuery, extraQueryOptions) {
	let URLBase = 'http://www.localhost:3030/groups'
	return URLBase;
}

let onClickButton = function() {

}

class AppComponent extends React.Component {
  render() {
  		return (
	      <div className='index'>
	      	<div className='container'>
				<SearchBar
		      		searchQueryURLFormatter={searchQueryURLFormatter}
		  		 	resultMapper={resultMapper}
					showImage={true}
					circularImage={true}
					maxResultsToDisplay={6}
					searchDelay={400}
					useNavLink={false}
					searchButton={{ show: true, onButtonClick: onClickButton }}
					noResultsMessage={"NO RESULTS FOUND"}
					extraOptions={{ sortBy: "date", onlyFriends: true }}
		  		 />
	      	</div>
	      </div>
	    );
  	}
  }
}

```

## Custom Example
```javascript

// ======= define 

class CustomLoadingCircle extends React.Component {
	render() {
		return(
			<div>LOADING...</div>
		)
	}
}

class CustomSearchResult extends React.Component {
	render() {
		return(
			<a href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}>
				<div>{this.props.title} - {this.props.isSelected.toString()}</div>
			</a>
		)
	}
}

class CustomSearchBar extends React.Component {
	render() {
		return(
			<div>
				<form>
					<div>
						<input type='text'
							value={this.props.searchValue}
							onKeyDown={this.props.onKeyDown}
							onFocus={this.props.onFocus}
							onChange={this.props.onChange} />
					</div>
				</form>
			</div>
		)
	}
}

class CustomNoResult extends React.Component {
	render() {
		return(
			<div>No Results Found</div>
		)
	}
}

let customResultGenerator = function(RSB, idx, resultJsonItem) {
	return(
		<CustomSearchResult
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}

let customLoadingBarGenerator = function(RSB) {
	return(<CustomLoadingCircle />)
}

let customNoResultProducer = function(RSB) {
	return (<CustomNoResult />)
}

let customSearchBarGenerator = function(RSB, inputTextValue, onKeyDown, onFocus, onChange) {
	return (
		<CustomSearchBar 
			searchValue={inputTextValue}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onChange={onChange}
		/>
	)
}

let resultMapper = function(queryResultJSON) {
	let formattedObjects = [];
	
	if(!isEmptyObject(queryResultJSON)) {
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
	}

	return formattedObjects;
}

let searchQueryURLFormatter = function(RSB, searchQuery, extraQueryOptions) {
	let URLBase = 'http://www.localhost:3030/groups'
	return URLBase;
}

class AppComponent extends React.Component {
  render() {
	return (
		<div className='index'>
			<div className='container'>
				<SearchBar searchQueryURLFormatter={searchQueryURLFormatter}
					 	resultMapper={resultMapper}
					 	customSearchBarProducer={customSearchBarGenerator}
					 	customResultsProducer={customResultGenerator}
					 	customLoadingBarProducer={customLoadingBarGenerator}
					 	customNoResultProducer={customNoResultProducer}
					 />
			</div>
		</div>
	);
  }
}

```

# Software Versions
# Security Concerns



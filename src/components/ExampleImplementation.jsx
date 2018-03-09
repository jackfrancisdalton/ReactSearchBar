import React from 'react'
import {
	NoResult,
	SearchResult,
} from './ChildComponents.jsx'

//======================= Define custom elements

class CustomSearchButton extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div>button</div>
		)
	}
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

class CustomSearchResult extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<a href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}>
				<div>{this.props.title} - {this.props.isSelected.toString()}</div>
			</a>
		)
	}
}

class CustomSearchBar extends React.Component {
	constructor(props) {
		super(props)
	}


	render() {
		return(
			<div>
				<form>
					<div>
						<input type='text'
							value={this.props.searchValue}
							onKeyDown={this.props.onKeyDown}
							onFocus={this.props.onFocus}
							onChange={this.props.onChange}
							className='search-input-text' />
					</div>
					<button>SEARCH</button>
				</form>
			</div>
		)
	}
}

//======================= Props to pass to RSB


let customResultGenerator = function(RSBRef, idx, resultJsonItem) {
	return(
		<CustomSearchResult
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}

let customLoadingBarGenerator = function(RSBRef) {
	return(<CustomLoadingCircle />)
}

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

let onClickButton = function(RSBRef, e, searchQuery, extraOptions) {
	e.preventDefault();
	console.log(searchQuery, extraOptions)
	console.log("HIT", RSBRef)
}

// this.state.searchQuery, this.handleKeyDown, this.onFocus, this.onType, this
let customSearchBarGenerator = function(RSBref, inputTextValue, onKeyDown, onFocus, onChange) {
	return (
		<CustomSearchBar 
			searchValue={inputTextValue}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onChange={onChange}
		/>
	)
}

let queryFormat = function(searchQuery, extraQueryOptions) {
	let URLBase = 'http://www.localhost:3030/groups'
	return URLBase;
}

export {
	mapperFunction,
	queryFormat,
	customResultGenerator,
	customLoadingBarGenerator,
	customSearchBarGenerator,
	onClickButton,
}
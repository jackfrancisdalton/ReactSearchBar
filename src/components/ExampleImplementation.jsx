import React from 'react'
import { NavLink } from 'react-router-dom';
import { NoResult, SearchResult } from './ChildComponents.jsx'
import { isEmptyObject } from './Utility.jsx'
 
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

let customNoResultProducer = function(self) {
	return (<CustomNoResult />)
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

let onClickButton = function(RSBRef, e, searchQuery, extraOptions) {
	e.preventDefault();
	console.log(searchQuery, extraOptions)
	console.log("HIT", RSBRef)
}


let mapperFunction = function(queryResultJSON) {
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

let queryFormat = function(searchQuery, extraQueryOptions) {
	let URLBase = 'http://www.localhost:3030/groupss'
	return URLBase;
}

export {
	mapperFunction,
	queryFormat,
	customResultGenerator,
	customLoadingBarGenerator,
	customNoResultProducer,
	customSearchBarGenerator,
	onClickButton,
}
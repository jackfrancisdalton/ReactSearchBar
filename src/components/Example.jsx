import React from 'react'
import { NavLink } from 'react-router-dom';
import { NoResult, SearchResult } from './ChildComponents.jsx'
import { isEmptyObject } from './Utility.jsx'
 
//======================= Define custom elements

class CustomLoadingCircle extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {

		const style = {
			"border": "3px solid red"
		}

		return(
			<div style={style}>
				<div>
					Custom Loading Component
				</div>
			</div>
		)
	}
}

class CustomSearchResult extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const style = {
			"border": "3px solid green",
			"display": "block"
		}

		return(
			<a style={style} href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}>
				<div>Custom Result : {this.props.title}</div>
			</a>
		)
	}
}

class CustomSearchBar extends React.Component {
	render() {

		const style = {
			"border": "3px solid yellow"
		}

		return(
			<div style={style}>
				<form>
					<h1>Custom Search Bar</h1>
					<div>
						<input type='text'
							value={this.props.searchValue}
							onKeyDown={this.props.onKeyDown}
							onFocus={this.props.onFocus}
							onChange={this.props.onChange}
							className='search-input-text' />
					</div>
					<label> video </label>
					<input type="checkbox" />
					<label> audio </label>
					<input type="checkbox" />
					<label> image </label>
					<input type="checkbox" />
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

		const style = {
			"border": "3px solid blue"
		}

		return(
			<div style={style}>custom no-results component</div>
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

let customLoadingBarGenerator = function(RSB) {
	return(<CustomLoadingCircle />)
}

let customNoResultProducer = function(RSB) {
	return (<CustomNoResult />)
}

// this.state.searchQuery, this.handleKeyDown, this.onFocus, this.onType, this
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

let onClickButton = function(RSBRef, event, searchQuery, extraOptions) {
	console.log("HIT")
}

let mapperFunction = function(RSB, queryResultJSON, requestError) {

	if(requestError) {
		return [];
	}
	
	let formattedObjects = [];
	
	if(!isEmptyObject(queryResultJSON)) {
		queryResultJSON.forEach(function(item, idx) {
			let hasAnyFields = (Object.keys(item).length !== 0)
			let isObject = (item.constructor === Object)

			if(hasAnyFields && isObject) {
				let newObject = {};
				newObject.title = item.name;
				newObject.imageURL = "https://www.fillmurray.com/100/100";
				newObject.targetURL = "www.website./com/myurl/" + item.id;
				formattedObjects.push(newObject);
			}
		});
	}

	return formattedObjects;
}

let queryFormat = function(RSB, searchQuery, extraQueryOptions) {
	let URLBase = 'https://jsonplaceholder.typicode.com/userdfds'
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
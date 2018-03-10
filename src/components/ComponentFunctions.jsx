import React from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom';
import { NoResult, SearchResult } from './ChildComponents.jsx'

const handleKeyDown = function(self, e) {
	if(!self.state.resultsLoading) {
		switch(e.keyCode) {
			// TAB
			case 9: {
				e.preventDefault();
				
				// handle tab when shift is held
				if(e.shiftKey) {
					let nextIndex = self.state.selectedResult - 1;
		    		if(self.state.selectedResult <= 0) { nextIndex = (self.props.resultsToDisplay - 1) }
		    		self.setState({ selectedResult: nextIndex })
				} else {
					let nextIndex = self.state.selectedResult + 1;
		    		if(self.state.selectedResult >= (self.props.resultsToDisplay - 1)) { nextIndex = 0 }
		    		self.setState({ selectedResult: nextIndex })
				}
				
				break;
			}
			// ENTER
			case 13: {
				e.preventDefault();

				// Go to the target URL of the result
				window.location.replace(self.state.resultSet[self.state.selectedResult].targetURL);

				self.setState({
					isActive: false,
					selectedResult: 0,
					resultsLoading: false
				})
				break;
			}
			// ESCAPE
			case 27: {
				e.preventDefault();
				self.setState({
					isActive: false,
					selectedResult: 0,
					searchQuery: '',
					resultsLoading: false
				})
				break;
			}
			// DOWN
			case 38: {
				e.preventDefault();
				let nextIndex = self.state.selectedResult - 1;
		    	if(self.state.selectedResult <= 0) { nextIndex = (self.props.resultsToDisplay - 1) }
		    	self.setState({ selectedResult: nextIndex })
				break;
			}
			// UP
	    	case 40: {
	    		e.preventDefault();
		    	let nextIndex = self.state.selectedResult + 1;
		    	if(self.state.selectedResult >= (self.props.resultsToDisplay - 1)) { nextIndex = 0 }
		    	self.setState({ selectedResult: nextIndex })
				break;
			}
	    }
	}
}

const resultFetch = function (self, finalSearchURL, isActive) {
	self.timeouts.push(setTimeout(function() {
		if(isActive) {
 			let promise = axios.get(finalSearchURL)
				.then(response => response.data)
				.then(data => {
					let formattedResults = self.props.resultMapper(self, data)

					self.setState({
						resultSet: formattedResults,
						resultsLoading: false,
						selectedResult: 0
					});
				}).catch(function(error) {
					console.error("error: ", error)
				})
		}
	}, self.props.searchDelay));
}

const onFocus = function(self, e) {
	if(self.state.searchQuery.length > 0) {
		let isActive = false;

		if(self.state.searchQuery) {
			isActive = true;
		}

		// activaite loading cover on result set
		self.setState({
			isActive: true,
			resultsLoading: true
		});

		// cancel pending requests
		self.timeouts.forEach(clearTimeout);
		
		let finalSearchURL = self.props.searchQueryURLFormatter(
			self.props.searchQuery,
			self.props.extraQueryOptions,
		)

		// make request based on new searchquery
		resultFetch(self, finalSearchURL, isActive)
	}
}


const onType = function(self, e) {
	let searchQuery = e.target.value;
	let isActive = false;

	// if searchquery is not nothing then search for result
	if(searchQuery.length) {
		isActive = true;
	}

	// activaite loading cover on result set
	self.setState({
		isActive: isActive,
		searchQuery: searchQuery,
		resultsLoading: true
	});

	// cancel pending requests
	self.timeouts.forEach(clearTimeout);

	// formats the search query URL
	let finalSearchURL = self.props.searchQueryURLFormatter(
		self.props.searchQuery,
		self.props.extraQueryOptions,
	)
	
	// make request based on new searchquery
	resultFetch(self, finalSearchURL, isActive)
}


const generateResults = function(self) {
		let selfRef = self;
		let results = [];

		// loop through results and generate component for each result and assign to results
		self.state.resultSet.forEach(function(item, idx) {

			// if the current result index is more than the desired amount, do not render a componenet
			if(selfRef.props.resultsToDisplay > idx) {

				//calculate if the result is selected
				let isSelected = ((selfRef.state.selectedResult == idx) ? true : false)
				results.push(
					<SearchResult key={idx}
						keyRef={idx} 
						title={item.title}
						targetURL={item.targetURL}
						imageURL={item.imageURL}
						showImage={selfRef.props.showImage}
						onHoverSelect={selfRef.onHoverSetSelected}
						isSelected={isSelected}
						onClick={selfRef.onResultClicked}
						useNavLink={selfRef.props.useNavLink}
						isCircleImage={selfRef.props.circularImage}/>
				)
			}
		});

		return results;
}

const generateCustomResults = function (self) {
	let selfRef = self;
	let results = [];

	self.state.resultSet.forEach(function(item, idx) {
		if(selfRef.props.resultsToDisplay > idx) {
			let isSelected = ((selfRef.state.selectedResult == idx) ? true : false)
			let customDOMResult = selfRef.props.customResultsProducer(selfRef, idx, item)
			
			// appened extra functions and props
			customDOMResult = React.cloneElement(customDOMResult, {
				key: idx,
				keyRef: idx,
				isSelected: isSelected,
				onHoverSelect: selfRef.onHoverSetSelected
			});

			results.push(customDOMResult);
		}
	})

	return results;
}

export default {
	handleKeyDown,
	onFocus,
	onType,
	generateResults,
	generateCustomResults
}
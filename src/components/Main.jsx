require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypeValidator from './PropTypeValidator.jsx'

import ComponentFunctions from './ComponentFunctions.jsx'

import {
	NoResult,
	SearchResult,
} from './ChildComponents.jsx'

import {
	mapperFunction,
	queryFormat,
	customBoxGenerator,
	customLoadingBarGenerator,
	searchBarProducer,
	onClickButton,
} from './ExampleImplementation.jsx'

class SearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isActive: false,
			searchQuery: '',
			resultSet: null,
			resultsLoading: false,
			selectedResult: 0
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.onFocus = this.onFocus.bind(this)
		this.onType = this.onType.bind(this)
		this.onHoverSetSelected = this.onHoverSetSelected.bind(this)
		this.onResultClicked = this.onResultClicked.bind(this)
		this.setWrapperRef = this.setWrapperRef.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.generateCustomResultsDOM = this.generateCustomResultsDOM.bind(this)
		this.generateResultsDOM = this.generateResultsDOM.bind(this)
	}

	// Set default values
	static defaultProps = {
		useNavLink: false,
		circularImage: false,
		searchDelay: 300,
		resultsToDisplay: 6,
		showImage: false,
		searchButton: { show: false },
		customResultComponentProducer: null,
		errorMessage: 'No Results Found'
	}

	componentWillMount() {
		this.timeouts = [];
	}

	componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.timeouts.forEach(clearTimeout);
    }

	handleKeyDown(e) {
		console.log("KEYDOWN")
		ComponentFunctions.handleKeyDown(this, e)	
	}

	onFocus(e) {
		console.log("FOCUS")
		ComponentFunctions.onFocus(this, e)
	}

	onType(e) {
		console.log("TYPE")
		ComponentFunctions.onType(this, e)
	}

	onResultClicked() {
		this.timeouts.forEach(clearTimeout);
		this.setState({ isActive: false })
	}

	onHoverSetSelected(newIndex) {
		// if not loading state, handle highlighting result on mouse hover
		if(!this.state.resultsLoading) {
			this.setState({
				selectedResult: newIndex
			});
		}
	}

	setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
    	// if the drop down is active, and the mouse clicks off of the results hide the results
        if(this.state.isActive) {
	        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	     		this.setState({ isActive: false })
	        }
        }
    }

    generateResultsDOM() {
    	let self = this;
		let results = [];

		// loop through results and generate component for each result and assign to results
		this.state.resultSet.forEach(function(item, idx) {

			// if the current result index is more than the desired amount, do not render a componenet
			if(self.props.resultsToDisplay > idx) {

				//calculate if the result is selected
				let isSelected = ((self.state.selectedResult == idx) ? true : false)
				results.push(
					<SearchResult key={idx}
						keyRef={idx} 
						title={item.title}
						targetURL={item.targetURL}
						imageURL={item.imageURL}
						showImage={self.props.showImage}
						onHoverSelect={self.onHoverSetSelected}
						isSelected={isSelected}
						onClick={self.onResultClicked}
						useNavLink={self.props.useNavLink}
						isCircleImage={self.props.circularImage}/>
				)
			}
		});

		return results;
    }

    generateCustomResultsDOM() {
    	let self = this;
		let results = [];

		this.state.resultSet.forEach(function(item, idx) {
			if(self.props.resultsToDisplay > idx) {
				let isSelected = ((self.state.selectedResult == idx) ? true : false)
				let customDOMResult = self.props.customResultComponentProducer(idx, item)
				
				// appened extra functions and props
				customDOMResult = React.cloneElement(customDOMResult, {
					key: idx,
					keyRef: idx,
					isSelected: isSelected,
					onHoverSelect: self.onHoverSetSelected
				});

				results.push(customDOMResult);
			}
		})

		return results;
    }

	render() {
		let self = this;
		let results = [];

		// If results are found generate the result display boxes
		if(this.state.resultSet != null) {

			// if custom result generator found
			if(this.props.customResultComponentProducer) {
				results = this.generateCustomResultsDOM()
			} else {
				results = this.generateResultsDOM()
			}
		}

		// If a loading bar is supplied overwrite the out-of-box Component
		let loadingBar
		if(this.props.customLoadingBarProducer) {
			loadingBar = this.props.customLoadingBarProducer()
		} else {
			loadingBar = (
				<div className='loading-results-cover'>
					<div className='position-container'>
						<div className='positioner'>
							<div className='loading-animation'></div>
						</div>
					</div>
				</div>
			)
		}
		
		// Generate button DOM
		let searchButton = (
			<button onClick={(event) => this.props.searchButton.onButtonClick(event)} className='search-button'>
				<svg className="search-icon" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
				    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
				    <path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</button>
		)
		

		let searchBarDOM
		if(this.props.customSearchBar) {
			searchBarDOM = this.props.customSearchBar(this, this.state.searchQuery, this.handleKeyDown, this.onFocus, this.onType);
		} else {
			searchBarDOM = (
				<div className='search-input-container'>
						<form className="search-input">
							<div className={'text-input-wrapper' + (this.props.searchButton.show ? ""  : " full-width")}>
								<input type='text'
									value={this.state.searchQuery}
									onKeyDown={this.handleKeyDown}
									onFocus={this.onFocus}
									onChange={this.onType}
									className='search-input-text' />
							</div>
							{this.props.searchButton.show &&
								searchButton
							}
						</form>
				</div>
			);
		}

		// If no results are found display "NO RESULTS FOUND"
		if(results != null) {
			if(results.length <= 0 && !this.state.resultsLoading) {
				results = (<NoResult message={this.props.errorMessage} />)
			}
		}

		return (
			<div className='search-bar-container' ref={this.setWrapperRef}>
				{searchBarDOM}
				{this.state.isActive &&
					<div className='drop-down-container'>
						<div className='drop-down'>
							{this.state.resultsLoading &&
								loadingBar
							}
							{!this.state.resultsLoading &&
								results
							}
						</div>
					</div>
				}
			</div>
		);
	}
}

// Property Validation
SearchBar.propTypes = PropTypeValidator

class AppComponent extends React.Component {
  render() {
    return (
      <div className='index'>
      	<div className='container'>
			<SearchBar
	      		searchQueryURLFormatter={queryFormat}
	  		 	resultMapper={mapperFunction}
	  		 	showImage={true}
	  		 	circularImage={true}
	  		 	customSearchBar={searchBarProducer}
	  		 	searchButton={{ show: true, onButtonClick: onClickButton }}
	  		 	searchDelay={400} />
      	</div>
      </div>
    );
  }
}

export default AppComponent;

//TODO
// remove custom button (process moved to button bar)
// add support for custom error message
// add support for class overrides
// add on click function to read me of custom result
// add theme option material theme, bootstrap theme
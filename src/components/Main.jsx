require('normalize.css/normalize.css');
import styles from 'styles/App.sass'
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
	customResultGenerator,
	customLoadingBarGenerator,
	customNoResultProducer,
	customSearchBarGenerator,
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
		noResultsMessage: 'No Results Found'
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
		ComponentFunctions.handleKeyDown(this, e)	
	}

	onFocus(e) {
		ComponentFunctions.onFocus(this, e)
	}

	onType(e) {
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
        if(this.state.isActive) {
	        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	     		this.setState({ isActive: false })
	        }
        }
    }

    generateResultsDOM() {
    	return ComponentFunctions.generateResults(this)
    }

    generateCustomResultsDOM() {
    	return ComponentFunctions.generateCustomResults(this)
    }

	render() {
		let self = this;
		let results = [];

		// If results are found generate the result display boxes
		if(this.state.resultSet != null) {
			if(this.props.customResultsProducer) {
				results = this.generateCustomResultsDOM()
			} else {
				results = this.generateResultsDOM()
			}
		}

		// If a loading bar is supplied overwrite the out-of-box Component
		let loadingBar
		if(this.props.customLoadingBarProducer) {
			loadingBar = this.props.customLoadingBarProducer(self)
		} else {
			loadingBar = (
				<div id="loading-results-cover" className='loading-results-cover'>
					<div id="position-container" className='position-container'>
						<div id="positioner" className='positioner'>
							<div id="loading-animation" className='loading-animation'></div>
						</div>
					</div>
				</div>
			)
		}
		

		let searchBarDOM
		if(this.props.customSearchBarProducer) {
			searchBarDOM = this.props.customSearchBarProducer(this, this.state.searchQuery, this.handleKeyDown, this.onFocus, this.onType);
		} else {
			searchBarDOM = (
				<div className='search-input-container'>
						<form className="search-input">
							<div className={'text-input-wrapper' + (this.props.searchButton.show ? ""  : " full-width")}>
								<input type='text'
									id='search-input-text'
									className='search-input-text'
									value={this.state.searchQuery}
									onKeyDown={this.handleKeyDown}
									onFocus={this.onFocus}
									onChange={this.onType} />
							</div>
							{this.props.searchButton.show &&
								<button onClick={
									(event) => this.props.searchButton.onButtonClick(
										self,
										event, 
										self.state.searchQuery, 
										self.props.extraOptions,
									)
								} className='search-button' id="search-button">
									<svg className="search-icon" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
									    <path className="search-path" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
									    <path className="background-path" d="M0 0h24v24H0z" fill="none"/>
									</svg>
								</button>
							}
						</form>
				</div>
			);
		}

		// If no results are found display "NO RESULTS FOUND"
		if(results != null) {
			if(results.length <= 0 && !this.state.resultsLoading) {
				if(this.props.customNoResultProducer) {
					results = this.props.customNoResultProducer(self)
				} else {
					results = (<NoResult message={this.props.noResultsMessage} />)
				}
			}
		}

		return (
			<div className={'search-bar-container'} ref={this.setWrapperRef}>
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
SearchBar.propTypes = PropTypeValidator



class AppComponent extends React.Component {
  render() {
  	let version = 1

  	if(version == 0) {
  		return (
	      <div className='index'>
	      	<div className='container'>
				<SearchBar
		      		searchQueryURLFormatter={queryFormat}
		  		 	resultMapper={mapperFunction}
		  		 />
	      	</div>
	      </div>
	    );
  	} else if(version == 1) {
  		return (
	      <div className='index'>
	      	<div className='container'>
				<SearchBar
		      		searchQueryURLFormatter={queryFormat}
		  		 	resultMapper={mapperFunction}
					showImage={true}
					circularImage={true}
					maxResultsToDisplay={3}
					searchDelay={400}
					useNavLink={false}
					searchButton={{ show: true, onButtonClick: onClickButton }}
					noResultsMessage={"NO RESULTS"}
					extraOptions={{"TEST": "Bob"}}
		  		 />
	      	</div>
	      </div>
	    );
  	} else {
  		return (
	      <div className='index'>
	      	<div className='container'>
				<SearchBar
		      		searchQueryURLFormatter={queryFormat}
		  		 	resultMapper={mapperFunction}
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
}

export default AppComponent;

// readme:
// RSB aims to acheive two things:
// - offer an out-of-the-box solution for a comprehensive predictive saerch box
// - work as a framework for handling request, and interactions, whilst allowing you to use your own bespoke react componenets

// required

// optional

// custom components


	// ======== Mandatory Porperties
	// searchQueryURLFormatter
	// resultMapper 
	
	// ======== Optional
	// showImage
	// circularImage
	// maxResultsToDisplay
	// searchDelay 
	// useNavLink
	// noResultsMessage
	// extraOptions
	// searchButton

	// ========= Custom options
	// customSearchBarProducer 
	// customResultsProducer
	// customLoadingBarProducer 
	// customNoResultProducer

//TODO
// move application to seperate file called "test"
// add support for custom error message
// add support for class overrides
// add on click function to read me of custom result
// add theme option material theme, bootstrap theme
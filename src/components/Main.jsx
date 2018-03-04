require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';
import { NavLink } from 'react-router-dom';
let yeomanImage = require('../images/yeoman.png');


class NoResult extends React.Component {
	render() {
		return(
			<div className="no-result-container">
				<div className="no-results-message">{this.props.message}</div>
			</div>
		)
	}
}

class SearchResult extends React.Component {
	constructor(props) {
		super(props)
		// index number
		// image url
		// image position
		// image class override
		// content 
		// content class override
		// 
	}

	onClick(event) {
		this.props.onClick();
	}

	render() {
		let content = []

		if(this.props.imageURL == null) {
			content = (
				<div className='info-container-full-width'>
					<div className='result-title'>{this.props.title}</div>
				</div>
			)
		} else  {
			content = [
				(
					<div className={'image-container' + (this.props.isCircleImage ? " circle-image" : "")}>
						<img className='result-image' src={"https://www.fillmurray.com/100/100"}/>
					</div>
				), (
					<div className='info-container'>
						<div className='result-title'>{this.props.title}</div>
					</div>
				)
			];
		}


		if(this.props.useNavLink) {
			return (
				<NavLink to={this.props.targetURL} title={this.props.title} 
					onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
					className={'search-result' + (this.props.isSelected ? " selected" : "")} >
					{content}
				</NavLink>
			)
		}
		
		return (
			<a href={this.props.targetURL} 
				title={this.props.title} 
				onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)} 
				className={'search-result' + (this.props.isSelected ? " selected" : "")} >
				{content}
			</a>
		)
	}
}

// class BasicSearchResult extends React.Component {
// 	constructor(props) {
// 		super(props)
// 	}

// 	render() {
// 		return(
// 			<a href={this.props.targetURL} onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}>
// 				<div>{this.props.title} - {this.props.isSelected.toString()}</div>
// 			</a>
// 		)
// 	}
// }


class SearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isActive: false,
			searchQuery: '',
			resultSet: null,
			resultsLoading: false,
			selectedResult: 0,
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.onFocus = this.onFocus.bind(this)
		this.onType = this.onType.bind(this)
		this.onHoverSetSelected = this.onHoverSetSelected.bind(this)
		this.onResultClicked = this.onResultClicked.bind(this)
		this.setWrapperRef = this.setWrapperRef.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
	}

	// Set default values
	static defaultProps = {
	  useNavLink: false,
	  circularImage: false,
	  searchDelay: 100,
	  resultsToDisplay: 6,
	  showImage: false,
	  customResultComponentGenerator: null,
	  errorMessage: "No Results Found",
	};

	// Property Validation
	static propTypes = {

		// Mandatory Porperties
		searchQueryURL: React.PropTypes.string.isRequired,
		searchQueryURLFormatter: function(props, propName, componentName) {
			let fn = props[propName];
			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 3)

			if(!fn.prototype) {
				throw new Error(propName + " is a required property")
			}

			if(!isFunction) { 
				return new Error(propName + ' must be a function'); 
			}

			if(!validVariableCount) { 
				return new Error(propName + ' function must have the 3 arguments: searchQuery(typeof string), queryString(typeof String), extraQueryOptions (typeof Anything)'); 
			}
		},
		resultMapper: function(props, propName, componentName) {
			let fn = props[propName];
			let isFunction = (typeof fn.prototype.constructor === 'function')
			let validVariableCount = (fn.prototype.constructor.length === 1)

			if(!fn.prototype) {
				throw new Error(propName + " is a required property")
			}

			if(!isFunction) { 
				return new Error(propName + ' must be a function'); 
			}

			if(!validVariableCount) { 
				return new Error(propName + ' function must have the argument: queryResultJSON (type of JSON)'); 
			}
		},
			
		// Optional Properties
		extraOptions: React.PropTypes.object,
		showImage: React.PropTypes.bool,
		circularImage: React.PropTypes.bool,
		maxResultsToDisplay: React.PropTypes.number,
		searchDelay: React.PropTypes.number,
		useNavLink: React.PropTypes.bool,
		errorMessage: React.PropTypes.string,
		customResultComponentGenerator: function(props, propName, componentName) {
			let fn = props[propName];

			if(fn) {
				let isFunction = (typeof fn.prototype.constructor === 'function')
				let validVariableCount = (fn.prototype.constructor.length === 2)

				if(!isFunction) { 
					return new Error(propName + ' must be a function'); 
				}

				if(!validVariableCount) { 
					return new Error(propName + ' function must have the 2 arguments: idx (type of Number), resultJsonItem(type of JSON)'); 
				}
			}
		}
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

		// if the drop down is loading don't allow navigation
		if(!this.state.resultsLoading) {
			switch(e.keyCode) {
				// TAB
				case 9: { 
					e.preventDefault();
					
					// handle tab when shift is held
					if(e.shiftKey) {
						let nextIndex = this.state.selectedResult - 1;
			    		if(this.state.selectedResult <= 0) { nextIndex = (this.props.resultsToDisplay - 1) }
			    		this.setState({ selectedResult: nextIndex })
					} else {
						let nextIndex = this.state.selectedResult + 1;
			    		if(this.state.selectedResult >= (this.props.resultsToDisplay - 1)) { nextIndex = 0 }
			    		this.setState({ selectedResult: nextIndex })
					}
					
					break;
				}
				// ENTER
				case 13: { 
					e.preventDefault();

					// Go to the target URL of the result
					window.location.replace(this.state.resultSet[this.state.selectedResult].targetURL);

					this.setState({
						isActive: false,
						selectedResult: 0,
						resultsLoading: false
					})
					break;
				}
				// ESCAPE
				case 27: { 
					e.preventDefault();
					this.setState({
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
					let nextIndex = this.state.selectedResult - 1;
			    	if(this.state.selectedResult <= 0) { nextIndex = (this.props.resultsToDisplay - 1) }
			    	this.setState({ selectedResult: nextIndex })
					break;
				}
				// UP
		    	case 40: {
		    		e.preventDefault();
			    	let nextIndex = this.state.selectedResult + 1;
			    	if(this.state.selectedResult >= (this.props.resultsToDisplay - 1)) { nextIndex = 0 }
			    	this.setState({ selectedResult: nextIndex })
					break;
				}
		    }
		}
		
	}

	onFocus(event) {
		if(this.state.searchQuery.length > 0) {
			let self = this;

			// activaite loading cover on result set
			this.setState({
				isActive: true,
				resultsLoading: true
			});

			// cancel pending requests
			this.timeouts.forEach(clearTimeout);
			
			let finalSearchURL = this.props.searchQueryURLFormatter(
				self.props.searchQuery,
				self.props.searchQueryURL,
				self.props.extraQueryOptions,
			)

			// make request based on new searchquery
			this.timeouts.push(setTimeout(function() {
	 			fetch(finalSearchURL)
					.then(response => response.json())
					.then(json => {
						let formattedResults = self.props.resultMapper(json)

						self.setState({
							resultSet: formattedResults,
							resultsLoading: false
						});
					})	
			}, self.props.searchDelay));
		}
	}

	onType(event) {
		let self = this;
		let searchQuery = event.target.value;
		let isActive = false;

		// if searchquery is not nothing then search for result
		if(searchQuery.length) {			
			isActive = true;
		}

		// activaite loading cover on result set
		this.setState({
			isActive: isActive,
			searchQuery: searchQuery,
			resultsLoading: true
		});

		// cancel pending requests
		this.timeouts.forEach(clearTimeout);

		// formats the search query URL
		let finalSearchURL = this.props.searchQueryURLFormatter(
			self.props.searchQuery,
			self.props.searchQueryURL,
			self.props.extraQueryOptions,
		)
		
		// make request based on new searchquery
		this.timeouts.push(setTimeout(function() {
			if(isActive) {
	 			fetch(finalSearchURL)
					.then(response => response.json())
					.then(json => {
						let formattedResults = self.props.resultMapper(json)

						self.setState({
							resultSet: formattedResults,
							resultsLoading: false
						});
					})	
			}
		}, self.props.searchDelay));	
	}

	onResultClicked() {
		this.timeouts.forEach(clearTimeout);
		this.setState({
			isActive: false,
		})
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

	render() {
		let self = this;
		let results = [];

		// If results are found
		if(this.state.resultSet != null) {

			// if custom result generator found
			if(!this.props.customResultComponentGenerator) {
				
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
									onHoverSelect={self.onHoverSetSelected} 
									isSelected={isSelected}
									onClick={self.onResultClicked}
									useNavLink={self.props.useNavLink} 
									isCircleImage={self.props.circularImage}/>
						)
					}
				})
			} else {

				// loop through results and generate component for each result and assign to results
				this.state.resultSet.forEach(function(item, idx) {
					if(self.props.resultsToDisplay > idx) {
						let isSelected = ((self.state.selectedResult == idx) ? true : false)
						let customDOMResult = self.props.customResultComponentGenerator(idx, item)
						
						// appened extra functions and props
						customDOMResult = React.cloneElement(customDOMResult,
							{
								key: idx,
								keyRef: idx,
								isSelected: isSelected,
								onHoverSelect: self.onHoverSetSelected
							}
						);

						results.push(customDOMResult);
					}
				})
			}
		}

		if(results != null) {
			if(results.length <= 0 && !this.state.resultsLoading) {
				results = (<NoResult message={this.props.errorMessage} />)
			}
		}
		
		return (
			<div className='search-bar-container' ref={this.setWrapperRef}>
				<div className='search-input-container'>
					<input type='text' 
							value={this.state.searchQuery} 
							onKeyDown={this.handleKeyDown} 
							onFocus={this.onFocus}
							onChange={this.onType} 
							className='search-input' />
				</div>
				{this.state.isActive &&
					<div className='drop-down-container' >
						<div className='drop-down'>
							{this.state.resultsLoading &&
								<div className='loading-results-cover'>
									<div className='position-container'>
										<div className="positioner">
											<div className="loading-animation"></div>
										</div>
									</div>
								</div>
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

let queryFormat = function(searchQuery, searchQueryURL, extraQueryOptions) {
	return searchQueryURL;
}

let customBoxGenerator = function(idx, resultJsonItem) {
	return(
		<BasicSearchResult 
			title={resultJsonItem.title}
			targetURL={resultJsonItem.targetURL}
			imageURL={resultJsonItem.imageURL} />
	)
}


class AppComponent extends React.Component {
  render() {
    return (
      <div className='index'>
      	<SearchBar 
      		searchQueryURL={"http://www.localhost:3030/groups"} 
  		 	resultMapper={mapperFunction}
  		 	circularImage={true}
  		 	searchDelay={400}
  		 	searchQueryURLFormatter={queryFormat}
  		 	extraQueryOptions={{ option1: true, option2: false }} />
      </div>
    );
  }
}

export default AppComponent;



//TODO
// add support for custom search bar
// add support for custom error message
// add support for custom loading bar
// add support for class overrides
// add on click function to read me of custom result 
// add theme option material theme, bootstrap theme
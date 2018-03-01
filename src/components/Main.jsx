require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';
import { NavLink } from 'react-router-dom';
let yeomanImage = require('../images/yeoman.png');

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

		if(this.props.useNavLink) {
			return (
				<NavLink to={this.props.targetURL} 
					title={this.props.title} 
					onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
					className={'search-result' + (this.props.isSelected ? " selected" : "")} >

					<div className={'image-container' + (this.props.circleImage ? " circle-image" : "")}><img className='result-image' src={"https://www.fillmurray.com/100/100"}/></div>
					<div className='info-container'><div className='result-title'>{this.props.title}</div></div>
				</NavLink>
			)
		}
		
		return (
			<a href={this.props.targetURL} 
				title={this.props.title} 
				onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)} 
				className={'search-result' + (this.props.isSelected ? " selected" : "")} >

				<div className={'image-container' + (this.props.circleImage ? " circle-image" : "")}><img className='result-image' src={"https://www.fillmurray.com/100/100"}/></div>
				<div className='info-container'><div className='result-title'>{this.props.title}</div></div>
			</a>
		)
	}
}

class BasicSearchResult extends React.Component {
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
	  customResultDOMGenerator: null,
	};

	// Property Validation
	static propTypes = {

		// Mandatory Porperties
		searchQueryURL: React.PropTypes.string.isRequired,
		
		queryFormatFunction: function(props, propName, componentName) {
			let fn = props[propName];
			let isFunction = (typeof fn.prototype.constructor !== 'function')
			let validVariableCount = (fn.prototype.constructor.length !== 3)

			if(!fn.prototype) {
				throw new Error(propName + " is a required property")
			}

			if(isFunction) { 
				return new Error(propName + ' must be a function'); 
			}

			if(validVariableCount) { 
				return new Error(propName + ' function must have the 3 arguments: searchQuery(typeof string), queryString(typeof String), queryFormatOptions (typeof Anything)'); 
			}
		},

		resultMapFunction: function(props, propName, componentName) {
			let fn = props[propName];
			let isFunction = (typeof fn.prototype.constructor !== 'function')
			let validVariableCount = (fn.prototype.constructor.length !== 1)

			if(!fn.prototype) {
				throw new Error(propName + " is a required property")
			}

			if(isFunction) { 
				return new Error(propName + ' must be a function'); 
			}

			if(validVariableCount) { 
				return new Error(propName + ' function must have the argument: queryResultJSON (type of JSON)'); 
			}
		},
			
		// Optional Properties
		extraOptions: React.PropTypes.object,
		showImage: React.PropTypes.bool,
		circleImage: React.PropTypes.bool,
		maxResultsToDisplay: React.PropTypes.number,
		searchDelay: React.PropTypes.number,
		useNavLink: React.PropTypes.bool,
		// customresultDOM: React.PropTypes.function,
		customResultDOMGenerator: function(props, propName, componentName) {
			let fn = props[propName];
			let isFunction = (typeof fn.prototype.constructor !== 'function')
			let validVariableCount = (fn.prototype.constructor.length !== 2)

			if(isFunction) { 
				console.log("NOT FUNCTION")
				return new Error(propName + ' must be a function'); 
			}

			if(validVariableCount) { 
				console.log("Wrong argument count")
				return new Error(propName + ' function must have the 2 arguments: idx (type of Number), resultJsonItem(type of JSON)'); 
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
			
			// make request based on new searchquery
			this.timeouts.push(setTimeout(function() {
	 			fetch(self.props.searchQueryURL)
					.then(response => response.json())
					.then(json => {
						setTimeout(function() {
							let formattedResults = self.props.resultMapFunction(json)
							self.setState({
								resultSet: formattedResults,
								resultsLoading: false
							});
						}, 500);
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
		
		// make request based on new searchquery
		this.timeouts.push(setTimeout(function() {
			if(isActive) {
	 			fetch(self.props.searchQueryURL)
					.then(response => response.json())
					.then(json => {
						setTimeout(function() {
							let formattedResults = self.props.resultMapFunction(json)
							
							self.props.queryFormatFunction(
								self.state.searchQuery,
								self.props.searchQueryURL,
								self.props.queryFormatOptions
							)
							
							self.setState({
								resultSet: formattedResults,
								resultsLoading: false
							});
						}, 500);
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
		console.log("HIT: ", newIndex)
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
			if(!this.props.customResultDOMGenerator) {
				
				// loop through results and generate component for each result and assign to results
				this.state.resultSet.forEach(function(item, idx) {

					// if the current result index is more than the desired amount, do not render a componenet
					if(self.props.resultsToDisplay > idx) {

						//calculate 
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
									circleImage={self.props.circleImage}/>
						)
					}
				})
			} else {

				// loop through results and generate component for each result and assign to results
				this.state.resultSet.forEach(function(item, idx) {
					if(self.props.resultsToDisplay > idx) {
						let isSelected = ((self.state.selectedResult == idx) ? true : false)
						let customDOMResult = self.props.customResultDOMGenerator(idx, item)
						
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
							<div>
								{this.state.resultsLoading &&
									<div className='loading-results-cover'>
										<div className="loading-result-message">
											<p>Loading...</p>
										</div>
									</div>
								}
								{results}
							</div>
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
		let newObject = {};
		newObject.title = item.groupName;
		newObject.imageURL = item.imgURL;
		newObject.targetURL = item.targetURL; 
		formattedObjects.push(newObject);
	});

	return formattedObjects;
}

let queryFormat = function(searchQuery, queryString, queryFormatOptions) {
	console.log("query: ", searchQuery)
	console.log("query string: ", queryString)
	console.log("options: ", queryFormatOptions)
	return queryString;
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
        <img src={yeomanImage} alt='Yeoman Generator' />
        <div className='notice'>Please edit <code>src/components/Main.js</code> to get started!</div>
      	<SearchBar 
      		searchQueryURL={"http://www.localhost:3030/groups"} 
      		searchDelay={200} 
      		useNavLink={false} 
      		circleImage={false}
      		customResultDOMGenerator={customBoxGenerator}
  		 	resultMapFunction={mapperFunction}
  		 	queryFormatFunction={queryFormat}
  		 	queryFormatOptions={{ option1: true, option2: false }} />
      </div>
    );
  }
}

export default AppComponent;



//TODO
// add support for class overrides
// add support for (has image) + (has subtitle)
// add support for "mapper function"
// add option for image/circle image or just text
// add theme option material theme, bootstrap theme
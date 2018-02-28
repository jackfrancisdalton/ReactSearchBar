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

	render() {

		if(this.props.useNavLink) {
			return (
				<NavLink to="#" 
					title={this.props.title} 
					onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
					className={'search-result' + (this.props.isSelected ? " selected" : "")} >

					<div className={'image-container' + (this.props.circleImage ? " circle-image" : "")}><img className='result-image' src={"https://www.fillmurray.com/100/100"}/></div>
					<div className='info-container'><div className='result-title'>{this.props.title}</div></div>
				</NavLink>
			)
		}
		
		return (
			<a href="#" 
				title={this.props.title} 
				onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)} 
				className={'search-result' + (this.props.isSelected ? " selected" : "")} >

				<div className={'image-container' + (this.props.circleImage ? " circle-image" : "")}><img className='result-image' src={"https://www.fillmurray.com/100/100"}/></div>
				<div className='info-container'><div className='result-title'>{this.props.title}</div></div>
			</a>
		)
	}
}

// class QueryResultBox extends React.Component {
// 	constructor(props) {
// 		super(props)
// 		// show section title
// 		// section title 
// 		// section class override
// 		// number of results desired
// 		// sort function 

// 		this.state = {
// 			resultSet: []
// 		}
// 	}

// 	componentWillReceiveProps(nextProps) {
// 		fetch(this.props.fetchURL)
// 			.then(response => response.json())
// 			.then(json => {
// 				this.setState({
// 					resultSet: json
// 				})
// 			})
// 	}

// 	render() {
// 		let self = this;
// 		let resultsDOM = []

// 		if(this.state.resultSet.length) {
// 			this.state.resultSet.forEach(function(item, idx) {
// 				if(idx < self.props.numResultsToShow ) {
// 					resultsDOM.push(<SearchResult title={item.title} />)
// 				}
// 			})
// 		}

// 		return(
// 			<div className='result-group'>
// 				<h3>{this.props.title}</h3>
// 				{resultsDOM}
// 			</div>
// 		)
// 	}
// }

// class DisplayResultBox extends React.Component {
// 	constructor(props) {
// 		super(props)
// 		// show section title
// 		// section title 
// 		// section class override
// 		// number of results desired
// 		// sort function 
// 	}

// 	render() {
// 		let resultItems = [];
// 		this.props.resultSet.forEach(function(item, idx) {
// 			resultItems.push(<SearchResult key={idx} title={item.title} img={item.img} />)
// 		})

// 		return(
// 			<div className='result-group'>
// 				{resultItems}
// 			</div>
// 		)
// 	}
// }

class SearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isActive: false,
			searchQuery: '',
			resultSet: '',
			resultsLoading: false,
			selectedResult: 0,
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.onType = this.onType.bind(this)
		this.onHoverSetSelected = this.onHoverSetSelected.bind(this)
		this.setWrapperRef = this.setWrapperRef.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
	}

	static defaultProps = {
	  useNavLink: false,
	  circularImage: false,
	  searchDelay: 100,
	  resultsToDisplay: 6
	};

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

		switch(e.keyCode) {
			// TAB
			case 9: { 
				e.preventDefault();
				
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

		this.timeouts.forEach(clearTimeout);
		this.timeouts.push(setTimeout(function() {
			if(isActive) {
	 			fetch(self.props.queryURL)
					.then(response => response.json())
					.then(json => {
						setTimeout(function() {
							self.setState({
								resultSet: json,
								resultsLoading: false
							});
						}, 500);
					})	
			}
		}, self.props.searchDelay));	
	}

	onHoverSetSelected(newIndex) {
		this.setState({
			selectedResult: newIndex
		});
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

		if(this.state.resultSet.length > 0) {
			this.state.resultSet.forEach(function(item, idx) {
				if(self.props.resultsToDisplay > idx) {
					let isSelected = ((self.state.selectedResult == idx) ? true : false)
					results.push(
						<SearchResult key={idx} 
								keyRef={idx} 
								title={item.title}
								onHoverSelect={self.onHoverSetSelected} 
								isSelected={isSelected}
								useNavLink={self.props.useNavLink} 
								circleImage={self.props.circleImage}/>
					)
				}
			})
		}

		return (
			<div className='search-bar-container' ref={this.setWrapperRef}>
				<div className='search-input-container'>
					<input type='text' value={this.state.searchQuery} onKeyDown={this.handleKeyDown} onChange={this.onType} className='search-input' />
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

class AppComponent extends React.Component {
  render() {
    return (
      <div className='index'>
        <img src={yeomanImage} alt='Yeoman Generator' />
        <div className='notice'>Please edit <code>src/components/Main.js</code> to get started!</div>
      	<SearchBar queryURL={"http://localhost:3030/users"} resultsToDisplay={3} searchDelay={200} useNavLink={false} circleImage={false} />
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
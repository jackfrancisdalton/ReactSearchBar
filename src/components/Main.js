require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';

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
		return (
			<div className={'search-result' + (this.props.isSelected ? " selected" : "")}>
				<div className='image-container'><img className='result-image' src={"http://via.placeholder.com/200x200"}/></div>
				<div className='info-container'><div className='result-title'>{this.props.title}</div></div>
			</div>
		)
	}
}

class QueryResultBox extends React.Component {
	constructor(props) {
		super(props)
		// show section title
		// section title 
		// section class override
		// number of results desired
		// sort function 

		this.state = {
			resultSet: []
		}
	}

	componentWillReceiveProps(nextProps) {
		fetch(this.props.fetchURL)
			.then(response => response.json())
			.then(json => {
				this.setState({
					resultSet: json
				})
			})
	}

	render() {
		let self = this;
		let resultsDOM = []

		if(this.state.resultSet.length) {
			this.state.resultSet.forEach(function(item, idx) {
				if(idx < self.props.numResultsToShow ) {
					resultsDOM.push(<SearchResult title={item.title} />)
				}
			})
		}

		return(
			<div className='result-group'>
				<h3>{this.props.title}</h3>
				{resultsDOM}
			</div>
		)
	}
}

class DisplayResultBox extends React.Component {
	constructor(props) {
		super(props)
		// show section title
		// section title 
		// section class override
		// number of results desired
		// sort function 
	}

	render() {
		let resultItems = [];
		this.props.resultSet.forEach(function(item, idx) {
			resultItems.push(<SearchResult key={idx} title={item.title} img={item.img} />)
		})

		return(
			<div className='result-group'>
				{resultItems}
			</div>
		)
	}
}

class SearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isActive: false,
			searchQuery: '',
			resultSet: '',
			resultsLoading: false,
			selectedResult: 0
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.onType = this.onType.bind(this)
	}

	handleKeyDown(e) {
		if (e.keyCode === 38) {
			let nextIndex = this.state.selectedResult - 1;

	    	if(this.state.selectedResult <= 0) {
	    		console.log("RESET B")
	    		nextIndex = (this.props.resultsToDisplay - 1)
	    	}
	    	
	    	this.setState({ selectedResult: nextIndex })
	    } else if (e.keyCode === 40) {
	    	let nextIndex = this.state.selectedResult + 1;

	    	if(this.state.selectedResult >= (this.props.resultsToDisplay - 1)) {
	    		nextIndex = 0

	    		console.log("RESET A")

	    	}
	    	
	    	this.setState({ selectedResult: nextIndex })
	    }
	}

	onType(event) {
		let self = this;
		let searchQuery = event.target.value;
		let isActive = false;

		if(searchQuery.length) {			
			isActive = true;
		}

		this.setState({
			isActive: isActive,
			searchQuery: searchQuery,
			resultsLoading: true
		});

		fetch(this.props.queryURL)
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

	render() {
		let self = this;
		let results = [];
		console.log(this.state.selectedResult)


		if(this.state.resultSet.length > 0) {
			this.state.resultSet.forEach(function(item, idx) {
				if(self.props.resultsToDisplay > idx) {
					let isSelected = ((self.state.selectedResult == idx) ? true : false)
					{results.push(<SearchResult key={idx} title={item.title} isSelected={isSelected} />)}
				}
			})
		}

		return (
			<div className='search-bar-container'>
				<div className='search-input-container'>
					<input type='text' value={this.state.searchQuery} onKeyDown={this.handleKeyDown} onChange={this.onType} className='search-input' />
				</div>
				{this.state.isActive &&
					<div className='drop-down-container'>
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
      	<SearchBar queryURL={"http://localhost:3030/users"} resultsToDisplay={3}></SearchBar>
      </div>
    );
  }
}


AppComponent.defaultProps = { };

export default AppComponent;

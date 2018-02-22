require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

var dataSet = [
	{
		title: "Jack",
		img: "http://via.placeholder.com/200x200"
	},
	{
		title: "John",
		img: "http://via.placeholder.com/200x200"
	},
	{
		title: "John",
		img: "http://via.placeholder.com/200x200"
	},
]

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
			<div className="search-result">
				<img className="result-image" src={this.props.img}/>
				<div className="result-title">{this.props.title}</div>
			</div>
		)
	}
}

class ResultSection extends React.Component {
	constructor(props) {
		super(props)
		// show section title
		// section title 
		// section class override
	}

	render() {
		let resultItems = [];
		this.props.dataSet.forEach(function(item, idx) {
			resultItems.push(<SearchResult title={item.title} img={item.img} />)
		})

		return(
			<div className="result-group">
				{resultItems}
			</div>
		)
	}
}

class SearchBar extends React.Component {
	constructor(props) {
		super(props)
		// dataset
		// query 

		this.state = {
			dataSet: dataSet
		}
	}

	render() {
		return(
			<div className="search-bar-container">
				<div className="search-input-container">
					<input className="search-input"></input>
				</div>
				<div className="drop-down-container">
					<div className="drop-down">
						<div className="loading-results-cover"></div>
						<ResultSection dataSet={this.state.dataSet} />
					</div>
				</div>
			</div>
		)
	}
}

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      	<SearchBar />
      </div>
    );
  }
}

AppComponent.defaultProps = {


};

export default AppComponent;

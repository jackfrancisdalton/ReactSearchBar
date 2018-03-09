import React from 'react'
import { NavLink } from 'react-router-dom';

class NoResult extends React.Component {
	render() {
		return(
			<div className='no-result-container'>
				<div className='no-results-message'>{this.props.message}</div>
			</div>
		)
	}
}

class SearchResult extends React.Component {
	constructor(props) {
		super(props)
	}

	onClick(event) {
		this.props.onClick();
	}

	render() {
		let content = []

		if(!this.props.showImage) {
			content = (
				<div className='info-container-full-width'>
					<div className='result-title'>{this.props.title}</div>
				</div>
			)
		} else  {
			content = [
				(
					<div key={1} className={'image-container' + (this.props.isCircleImage ? ' circle-image' : '')}>
						<img className='result-image' src={'https://www.fillmurray.com/100/100'}/>
					</div>
				), (
					<div key={2} className='info-container'>
						<div className='result-title'>{this.props.title}</div>
					</div>
				)
			];
		}


		if(this.props.useNavLink) {
			return (
				<NavLink to={this.props.targetURL} title={this.props.title}
					onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
					className={'search-result' + (this.props.isSelected ? ' selected' : '')} >
					{content}
				</NavLink>
			)
		}
		
		return (
			<a href={this.props.targetURL}
				title={this.props.title}
				onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}
				className={'search-result' + (this.props.isSelected ? ' selected' : '')} >
				{content}
			</a>
		)
	}
}



export {
	NoResult,
	SearchResult,
}
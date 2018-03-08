
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

const onFocus = function(self, e) {
	if(self.state.searchQuery.length > 0) {
		let selfRef = self;

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
		self.timeouts.push(setTimeout(function() {
 			fetch(finalSearchURL)
				.then(response => response.json())
				.then(json => {
					let formattedResults = selfRef.props.resultMapper(json)

					selfRef.setState({
						resultSet: formattedResults,
						resultsLoading: false,
					});
				})
		}, self.props.searchDelay));
	}
}


const onType = function(self, e) {
	let selfRef = self;
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
	self.timeouts.push(setTimeout(function() {
		if(isActive) {
 			fetch(finalSearchURL)
				.then(response => response.json())
				.then(json => {
					let formattedResults = selfRef.props.resultMapper(json)

					selfRef.setState({
						resultSet: formattedResults,
						resultsLoading: false,
						selectedResult: 0
					});
				})
		}
	}, self.props.searchDelay));
}


export default {
	handleKeyDown,
	onFocus,
	onType
}
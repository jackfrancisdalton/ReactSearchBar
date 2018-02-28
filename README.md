# React Search Bar

generic search bar components 
The aim of this package is to give you features out of the box
* deferred query firing while typing
* keyboard and mouse result selection 
* 

## Properties

### Manditory Props
queryurl		- base query for finding results
resultMapFunction 	- function for mapping results to viewmodel
queryFormatFunction 	- function for positioning 


### Optional Props

customresultDOM 
if you do not want the generic result, create a function with your own dom element
whatever you create we will appened the properties behind the scenes
- keyRef a unique identified for 
- isSelected (will be true on the currently selected result), use this however you want for styling 
- defaultOnClick (if called from an onclick will use the default
- onHoverSelect, method for telling the component which object is selected
	to add simply add the following line to onMouseOver={() => this.props.onHoverSelect(this.props.keyRef)}

properties like use circle, show image, use navlink


for thos using react router, and option for using NavLink for client side redirection is there

### Default Props
useNavLink: false,
circularImage: false,
searchDelay: 100,
resultsToDisplay: 6

## exposed functions 
should you want to call functions using your website functions are exposed
* search (for search button usage)
* clear box 
* set box value
* copy box content value
* return current selected data set

# Support 

# Style
## Themes
## Custom Styles


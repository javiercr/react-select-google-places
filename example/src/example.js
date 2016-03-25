var React = require('react');
var ReactDOM = require('react-dom');
var SelectGooglePlaces = require('react-select-google-places');

var App = React.createClass({
	render () {
		return (
			<div>
        <h2>Demo Single selection</h2>
        <SelectGooglePlaces optionsForSelect={{multi: false}} />
        <h2>Demo Multiple selection</h2>
        <SelectGooglePlaces optionsForSelect={{multi: true}} />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));

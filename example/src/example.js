var React = require('react');
var ReactDOM = require('react-dom');
var SelectGooglePlaces = require('react-select-google-places');

var App = React.createClass({
  onChange (value) {
    console.log(value);
  },
	render () {
		return (
			<div>
        <h2>Demo Single selection</h2>
        <SelectGooglePlaces optionsForSelect={{multi: false, cache: false}} onChange={this.onChange} />
        <h2>Demo Multiple selection</h2>
        <SelectGooglePlaces optionsForSelect={{multi: true, cache: false}} onChange={this.onChange} />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));

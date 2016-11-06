var React = require('react');
var ReactDOM = require('react-dom');
var SelectGooglePlaces = require('react-select-google-places');

const API_KEY = '<YOUR-API-KEY>';

var App = React.createClass({
  onChange (value) {
    console.log(value);
  },
	render () {
		return (
			<div>
        <h2>Demo Single selection</h2>
        <SelectGooglePlaces apiKey={API_KEY} optionsForSelect={{multi: false, cache: false}} initialValue={{label: 'New York', value: 'New York'}} onChange={this.onChange} />
        <h2>Demo Multiple selection</h2>
        <SelectGooglePlaces apiKey={API_KEY} optionsForSelect={{multi: true, cache: false }} initialValue={[{label: 'New York', value: 'New York'}, {label: 'Chicago', value: 'Chicago'}]} onChange={this.onChange} />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));

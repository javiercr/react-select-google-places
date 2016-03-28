'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _scriptjs = require('scriptjs');

var _scriptjs2 = _interopRequireDefault(_scriptjs);

var React = require('react');

var SelectGooglePlaces = React.createClass({
  displayName: 'SelectGooglePlaces',

  propTypes: {
    multi: React.PropTypes.bool, // Single or multiple places selection
    language: React.PropTypes.string, // Language code for loading Google Maps API
    country: React.PropTypes.string, // ISO 3166-1 Alpha-2 country code for limiting results
    types: React.PropTypes.array, // Types of results to be displayed
    // See https://developers.google.com/places/supported_types#table3
    formatName: React.PropTypes.func, // Receives the result placesService.getDetails() and returns a formatted name
    // See https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult
    onChange: React.PropTypes.func, // onChange handler: function (newValue) {}
    optionsForSelect: React.PropTypes.object // See https://github.com/JedWatson/react-select#further-options

  },

  getDefaultProps: function getDefaultProps() {
    return {
      language: 'en',
      country: 'USA',
      types: ['(cities)'],
      formatName: function formatName(placeResult) {
        return placeResult.address_components[0].long_name;
      },
      optionsForSelect: {
        multi: true,
        cache: false,
        name: 'places'
      }
    };
  },

  getInitialState: function getInitialState() {
    return {
      value: null,
      autocompleteService: null,
      placesService: null
    };
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    if (typeof window.google === 'undefined') {
      window.googleMapsLoaded = function () {
        _scriptjs2['default'].done('google-maps-places');
      };

      (0, _scriptjs2['default'])('https://maps.googleapis.com/maps/api/js?libraries=places&language=' + this.props.language, 'google-maps-places');
      _scriptjs2['default'].ready('google-maps-places', function () {
        _this.handleLoaded(google.maps);
      });
    } else {
      this.handleLoaded(google.maps);
    }
  },

  handleLoaded: function handleLoaded(googleMaps) {
    this.setState({
      autocompleteService: new googleMaps.places.AutocompleteService(),
      placesService: new googleMaps.places.PlacesService(this.refs.attributions)
    });
  },

  onChange: function onChange(value) {
    var _this2 = this;

    var selectedPlace = undefined;
    if (value.constructor === Array) {
      selectedPlace = value[value.length - 1];
    } else {
      selectedPlace = value;
    }

    // Once a place is selected, fetch more data for it (long_name, lat, lng, etc.)
    if (selectedPlace) {
      this.processPlace(selectedPlace, function () {
        _this2.setState({ value: value });
        if (_this2.props.onChange) {
          _this2.props.onChange(value);
        }
      });
    } else {
      this.setState({ value: [] });
      this.props.onChange([]);
    }
  },

  processPlace: function processPlace(autocompletePrediction, callback) {
    var _this3 = this;

    this.state.placesService.getDetails({ placeId: autocompletePrediction.place_id }, function (placeResult) {
      autocompletePrediction = _extends(autocompletePrediction, placeResult);
      autocompletePrediction.description = _this3.props.formatName(placeResult);
      callback();
    });
  },

  getPredictions: function getPredictions(input, callback) {
    if (this.state.autocompleteService && input) {
      var geocoderRequest = {
        input: input,
        types: this.props.types,
        componentRestrictions: {
          country: this.props.country
        }
      };
      this.state.autocompleteService.getPlacePredictions(geocoderRequest, function (data) {
        callback(null, { options: data, complete: false });
      });
    }
    callback(null, { options: [], complete: false });
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(_reactSelect2['default'].Async, _extends({ value: this.state.value, valueKey: 'description', labelKey: 'description', loadOptions: this.getPredictions, onChange: this.onChange }, this.props.optionsForSelect)),
      React.createElement('div', { ref: 'attributions' })
    );
  }
});

exports['default'] = SelectGooglePlaces;
module.exports = exports['default'];
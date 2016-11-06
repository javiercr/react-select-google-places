'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _littleLoader = require('little-loader');

var _littleLoader2 = _interopRequireDefault(_littleLoader);

var SelectGooglePlaces = (function (_React$Component) {
  _inherits(SelectGooglePlaces, _React$Component);

  function SelectGooglePlaces(props) {
    _classCallCheck(this, SelectGooglePlaces);

    _get(Object.getPrototypeOf(SelectGooglePlaces.prototype), 'constructor', this).call(this, props);
    this.getPredictions = this.getPredictions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: this.props.initialValue,
      autocompleteService: null,
      placesService: null,
      googleMapsLoading: false
    };
  }

  _createClass(SelectGooglePlaces, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      if (typeof window.google === 'undefined') {
        var _props = this.props;
        var language = _props.language;
        var apiKey = _props.apiKey;

        if (window.googleMapsLoading) {
          this.waitForGoogleAPI();
        } else {
          window.googleMapsLoading = true;
          (0, _littleLoader2['default'])('https://maps.googleapis.com/maps/api/js?libraries=places&language=' + language + '&key=' + apiKey, function (err) {
            if (!err) {
              window.googleMapsLoading = false;
              _this.handleLoaded(window.google.maps);
            }
          });
        }
      } else {
        this.handleLoaded(window.google.maps);
      }
    }
  }, {
    key: 'waitForGoogleAPI',
    value: function waitForGoogleAPI() {
      var _this2 = this;

      setTimeout(function () {
        if (!window.googleMapsLoading) {
          _this2.handleLoaded(window.google.maps);
        }
      }, 300);
    }
  }, {
    key: 'onChange',
    value: function onChange(value) {
      var _this3 = this;

      var selectedPlace = undefined;
      if (value && value.constructor === Array) {
        selectedPlace = value[value.length - 1];
      } else {
        selectedPlace = value;
      }

      // Once a place is selected, fetch more data for it (long_name, lat, lng, etc.)
      if (selectedPlace) {
        this.processPlace(selectedPlace, function () {
          _this3.setState({ value: value });
          if (_this3.props.onChange) {
            _this3.props.onChange(value);
          }
        });
      } else {
        this.setState({ value: value });
        this.props.onChange(value);
      }
    }
  }, {
    key: 'getPredictions',
    value: function getPredictions(input, callback) {
      if (this.state.autocompleteService && input) {
        var geocoderRequest = {
          input: input,
          types: this.props.types,
          componentRestrictions: {
            country: this.props.country
          }
        };
        this.state.autocompleteService.getPlacePredictions(geocoderRequest, function (data) {
          // Copy description into the name attribute
          if (data) {
            data.map(function (result) {
              result.label = result.description;
              result.value = result.description;
            });
          }
          callback(null, { options: data, complete: false });
        });
      } else {
        callback(null, { options: [], complete: false });
      }
    }
  }, {
    key: 'processPlace',
    value: function processPlace(autocompletePrediction, callback) {
      var _this4 = this;

      if (!autocompletePrediction.place_id) {
        callback();
        return;
      }
      this.state.placesService.getDetails({ placeId: autocompletePrediction.place_id }, function (placeResult) {
        autocompletePrediction = _extends(autocompletePrediction, placeResult);
        autocompletePrediction.name = _this4.props.formatName(placeResult);
        callback();
      });
    }
  }, {
    key: 'handleLoaded',
    value: function handleLoaded(googleMaps) {
      this.setState({
        autocompleteService: new googleMaps.places.AutocompleteService(),
        placesService: new googleMaps.places.PlacesService(this.attributionsEl)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2['default'].createElement(
        'span',
        null,
        _react2['default'].createElement(_reactSelect2['default'].Async, _extends({ value: this.state.value, loadOptions: this.getPredictions, onChange: this.onChange }, this.props.optionsForSelect)),
        _react2['default'].createElement('div', { ref: function (el) {
            return _this5.attributionsEl = el;
          } })
      );
    }
  }]);

  return SelectGooglePlaces;
})(_react2['default'].Component);

SelectGooglePlaces.propTypes = {
  apiKey: _react2['default'].PropTypes.string.isRequired, // API Key
  language: _react2['default'].PropTypes.string, // Language code for loading Google Maps API
  country: _react2['default'].PropTypes.string, // ISO 3166-1 Alpha-2 country code for limiting results
  types: _react2['default'].PropTypes.array, // Types of results to be displayed
  // See https://developers.google.com/places/supported_types#table3
  formatName: _react2['default'].PropTypes.func, // Receives the result placesService.getDetails() and returns a formatted name
  // See https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult
  onChange: _react2['default'].PropTypes.func, // onChange handler: function (newValue) {}
  optionsForSelect: _react2['default'].PropTypes.object, // See https://github.com/JedWatson/react-select#further-options
  initialValue: _react2['default'].PropTypes.any
};

SelectGooglePlaces.defaultProps = {
  language: 'en',
  country: 'USA',
  types: ['(cities)'],
  formatName: function formatName(placeResult) {
    return placeResult.address_components[0].long_name;
  },
  optionsForSelect: {
    multi: false,
    cache: false,
    name: 'places'
  },
  onChange: function onChange() {},
  initialValue: null
};

exports['default'] = SelectGooglePlaces;
module.exports = exports['default'];
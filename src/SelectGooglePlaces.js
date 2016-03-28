var React = require('react');

import Select from 'react-select';
import scriptjs from 'scriptjs';

const SelectGooglePlaces = React.createClass({
  displayName: 'SelectGooglePlaces',

  propTypes: {
    multi: React.PropTypes.bool,              // Single or multiple places selection
    language: React.PropTypes.string,         // Language code for loading Google Maps API
    country: React.PropTypes.string,          // ISO 3166-1 Alpha-2 country code for limiting results
    types: React.PropTypes.array,             // Types of results to be displayed
                                              // See https://developers.google.com/places/supported_types#table3
    formatName: React.PropTypes.func,         // Receives the result placesService.getDetails() and returns a formatted name
                                              // See https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult
    onChange: React.PropTypes.func,           // onChange handler: function (newValue) {}
    optionsForSelect: React.PropTypes.object  // See https://github.com/JedWatson/react-select#further-options

  },

  getDefaultProps () {
    return {
      language: 'en',
      country: 'USA',
      types: ['(cities)'],
      formatName(placeResult) {
        return placeResult.address_components[0].long_name;
      },
      optionsForSelect: {
        multi: true,
        cache: false,
        name: 'places'
      }
    };
  },

  getInitialState () {
    return {
      value: null,
      autocompleteService: null,
      placesService: null
    };
  },

  componentDidMount() {
    if (typeof window.google === 'undefined') {
      window.googleMapsLoaded = () => {
        scriptjs.done('google-maps-places');
      };

      scriptjs(`https://maps.googleapis.com/maps/api/js?libraries=places&language=${this.props.language}`, 'google-maps-places');
      scriptjs.ready('google-maps-places', () => {
        this.handleLoaded(google.maps);
      });
    } else {
      this.handleLoaded(google.maps);
    }
  },

  handleLoaded(googleMaps) {
    this.setState({ 
      autocompleteService: new googleMaps.places.AutocompleteService(),
      placesService: new googleMaps.places.PlacesService(this.refs.attributions)
    });
  },

  onChange (value) {
    let selectedPlace;
    if (value.constructor === Array) {
      selectedPlace = value[value.length - 1];
    } else {
      selectedPlace = value;
    }

    // Once a place is selected, fetch more data for it (long_name, lat, lng, etc.)
    if (selectedPlace) {
      this.processPlace(selectedPlace, () => this.setState({ value: value }));
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    } else {
      this.setState({ value: [] });
      this.props.onChange([]);
    }
  },

  processPlace (autocompletePrediction, callback) {
    this.state.placesService.getDetails({placeId: autocompletePrediction.place_id}, (placeResult) => {
      autocompletePrediction = Object.assign(autocompletePrediction, placeResult);
      autocompletePrediction.description = this.props.formatName(placeResult);
      callback();
    });
  },

  getPredictions (input, callback) {
    if (this.state.autocompleteService && input) {
      const geocoderRequest = { 
        input: input, 
        types: this.props.types,
        componentRestrictions: {
          country: this.props.country
        }
      };
      this.state.autocompleteService.getPlacePredictions(geocoderRequest, function(data){
        callback(null, {options: data, complete: false});
      });  
    }
    callback(null, {options: [], complete: false});
  },

  render () {
    return (
      <div>
        <Select.Async value={this.state.value} valueKey="description" labelKey="description" loadOptions={this.getPredictions} onChange={this.onChange} {...this.props.optionsForSelect} />
        <div ref="attributions"></div>
      </div>
    );
  }
});


export default SelectGooglePlaces;
import React from 'react';
import Select from 'react-select';
import load from 'little-loader';

class SelectGooglePlaces extends React.Component {
  constructor(props) {
    super(props);
    this.getPredictions = this.getPredictions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: this.props.initialValue,
      autocompleteService: null,
      placesService: null,
      googleMapsLoading: false,
    };
  }

  componentDidMount() {
    if (typeof window.google === 'undefined') {
      const { language, apiKey } = this.props;
      if (window.googleMapsLoading) {
        this.waitForGoogleAPI();
      } else {
        window.googleMapsLoading = true; 
        load(`https://maps.googleapis.com/maps/api/js?libraries=places&language=${language}&key=${apiKey}`, (err) => {
          if (!err) {
            window.googleMapsLoading = false;
            this.handleLoaded(window.google.maps);
          }
        });
      }
    } else {
      this.handleLoaded(window.google.maps);
    }
  }

  waitForGoogleAPI() {
    setTimeout(() => {
      if (!window.googleMapsLoading) {
        this.handleLoaded(window.google.maps);
      }
    }, 300);
  }

  onChange(value) {
    let selectedPlace;
    if (value && value.constructor === Array) {
      selectedPlace = value[value.length - 1];
    } else {
      selectedPlace = value;
    }

    // Once a place is selected, fetch more data for it (long_name, lat, lng, etc.)
    if (selectedPlace) {
      this.processPlace(selectedPlace, () => {
        this.setState({ value });
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      });
    } else {
      this.setState({ value });
      this.props.onChange(value);
    }
  }

  getPredictions(input, callback) {
    if (this.state.autocompleteService && input) {
      const geocoderRequest = {
        input,
        types: this.props.types,
        componentRestrictions: {
          country: this.props.country,
        },
      };
      this.state.autocompleteService.getPlacePredictions(geocoderRequest, (data) => {
        // Copy description into the name attribute
        if (data) {
          data.map((result) => {
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

  processPlace(autocompletePrediction, callback) {
    if (!autocompletePrediction.place_id) {
      callback();
      return;
    }
    this.state.placesService.getDetails({ placeId: autocompletePrediction.place_id }, (placeResult) => {
      autocompletePrediction = Object.assign(autocompletePrediction, placeResult);
      autocompletePrediction.name = this.props.formatName(placeResult);
      callback();
    });
  }

  handleLoaded(googleMaps) {
    this.setState({
      autocompleteService: new googleMaps.places.AutocompleteService(),
      placesService: new googleMaps.places.PlacesService(this.attributionsEl),
    });
  }

  render() {
    return (
      <span>
        <Select.Async value={this.state.value} loadOptions={this.getPredictions} onChange={this.onChange} {...this.props.optionsForSelect} />
        <div ref={(el) => this.attributionsEl = el}></div>
      </span>
    );
  }
}

SelectGooglePlaces.propTypes = {
  apiKey: React.PropTypes.string.isRequired, // API Key
  language: React.PropTypes.string,          // Language code for loading Google Maps API
  country: React.PropTypes.string,           // ISO 3166-1 Alpha-2 country code for limiting results
  types: React.PropTypes.array,              // Types of results to be displayed
                                             // See https://developers.google.com/places/supported_types#table3
  formatName: React.PropTypes.func,          // Receives the result placesService.getDetails() and returns a formatted name
                                             // See https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult
  onChange: React.PropTypes.func,            // onChange handler: function (newValue) {}
  optionsForSelect: React.PropTypes.object,  // See https://github.com/JedWatson/react-select#further-options
  initialValue: React.PropTypes.any,
};

SelectGooglePlaces.defaultProps = {
  language: 'en',
  country: 'USA',
  types: ['(cities)'],
  formatName: (placeResult) => placeResult.address_components[0].long_name,
  optionsForSelect: {
    multi: false,
    cache: false,
    name: 'places',
  },
  onChange: () => {},
  initialValue: null,
};

export default SelectGooglePlaces;

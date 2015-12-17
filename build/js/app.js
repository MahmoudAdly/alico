'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var SearchForm = React.createClass({
  displayName: 'SearchForm',

  getInitialState: function getInitialState() {
    return {
      cities: [],
      currentCity: null,
      districts: [],
      currentDistrict: null,
      types: [],
      currentType: null,
      specialities: [],
      currentSpeciality: null,
      places: []
    };
  },
  componentDidMount: function componentDidMount() {
    // get cities
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.citiesPath,
        dataType: 'json',
        cache: false,
        success: (function (data) {
          self.setState({ cities: data.data });
        }).bind(self),
        error: (function (xhr, status, err) {
          console.error(self.props.citiesPath, status, err.toString());
        }).bind(self)
      });
    }, 10);

    // get types
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.typesPath,
        dataType: 'json',
        cache: false,
        success: (function (data) {
          self.setState({ types: data.data });
        }).bind(self),
        error: (function (xhr, status, err) {
          console.error(self.props.typesPath, status, err.toString());
        }).bind(self)
      });
    }, 10);

    // get specialities
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.specialitiesPath,
        dataType: 'json',
        cache: false,
        success: (function (data) {
          self.setState({ specialities: data.data });
        }).bind(self),
        error: (function (xhr, status, err) {
          console.error(self.props.specialitiesPath, status, err.toString());
        }).bind(self)
      });
    }, 10);
  },
  cityChanged: function cityChanged(event) {
    this.setState({ currentCity: event.target.value }, function () {
      // get districts
      $.ajax({
        url: this.props.districtsPath,
        dataType: 'json',
        data: { city: this.state.currentCity },
        cache: false,
        success: (function (data) {
          this.setState({ districts: data.data });
        }).bind(this),
        error: (function (xhr, status, err) {
          console.error(this.props.districtsPath, status, err.toString());
        }).bind(this)
      });
    });
  },
  districtChanged: function districtChanged(event) {
    this.setState({ currentDistrict: event.target.value });
  },
  typeChanged: function typeChanged(event) {
    this.setState({ currentType: event.target.value });
  },
  specialityChanged: function specialityChanged(event) {
    this.setState({ currentSpeciality: event.target.value });
  },
  handleSearch: function handleSearch(event) {
    event.preventDefault();
    // get places
    $.ajax({
      url: this.props.placesPath,
      dataType: 'json',
      data: {
        city: this.state.currentCity,
        district: this.state.currentDistrict,
        type: this.state.currentType,
        speciality: this.state.currentSpeciality
      },
      cache: false,
      success: (function (data) {
        this.props.onSearchResults(data.data);
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.placesPath, status, err.toString());
      }).bind(this)
    });
  },
  render: function render() {
    return React.createElement(
      'form',
      { id: 'searchform', onSubmit: this.handleSearch },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-2 small-offset-1 columns' },
          React.createElement(
            'label',
            { htmlFor: 'cityBox' },
            React.createElement(
              'b',
              null,
              'المدينة'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'small-8 large-7 columns end' },
          React.createElement(
            'select',
            { id: 'cityBox', name: 'city', value: this.state.currentCity, onChange: this.cityChanged },
            React.createElement('option', { value: '' }),
            this.state.cities.map(function (city, idx) {
              return React.createElement(
                'option',
                { value: city, key: idx },
                city
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-2 small-offset-1 columns' },
          React.createElement(
            'label',
            { htmlFor: 'districtBox' },
            React.createElement(
              'b',
              null,
              'الحي'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'small-8 large-7 columns end' },
          React.createElement(
            'select',
            { id: 'districtBox', name: 'district', value: this.state.currentDistrict, onChange: this.districtChanged },
            this.state.districts.map(function (district, idx) {
              return React.createElement(
                'option',
                { value: district, key: idx },
                district
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-2 small-offset-1 columns' },
          React.createElement(
            'label',
            { htmlFor: 'typeBox' },
            React.createElement(
              'b',
              null,
              'النوع',
              React.createElement(
                'span',
                { className: 'red-text' },
                '*'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'small-8 large-7 columns end' },
          React.createElement(
            'select',
            { id: 'typeBox', name: 'type', value: this.state.currentType, onChange: this.typeChanged },
            React.createElement('option', { value: '' }),
            this.state.types.map(function (type, idx) {
              return React.createElement(
                'option',
                { value: type, key: idx },
                type
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-2 small-offset-1 columns' },
          React.createElement(
            'label',
            { htmlFor: 'specialityBox' },
            React.createElement(
              'b',
              null,
              'التخصص',
              React.createElement(
                'span',
                { className: 'red-text' },
                '*'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'small-8 large-7 columns end' },
          React.createElement(
            'select',
            { id: 'specialityBox', name: 'speciality', value: this.state.currentSpeciality, onChange: this.specialityChanged },
            React.createElement('option', { value: '' }),
            this.state.specialities.map(function (speciality, idx) {
              return React.createElement(
                'option',
                { value: speciality, key: idx },
                speciality
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-10 small-offset-1 columns end' },
          React.createElement(
            'label',
            { className: 'red-text' },
            '* لا يشترط اختيار كليهما'
          )
        )
      ),
      React.createElement('br', null),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'small-12 large-3 small-centered columns' },
          React.createElement('input', { id: 'submitsearch', className: 'button radius expand', type: 'submit', value: 'بحث' })
        )
      )
    );
  }
});

var SearchResults = React.createClass({
  displayName: 'SearchResults',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'table',
        { id: 'resultstable' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'الاسم'
            ),
            React.createElement(
              'th',
              null,
              'معلومات'
            ),
            React.createElement('th', null)
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.props.results.map(function (result, idx) {
            return React.createElement(
              'tr',
              { key: idx },
              React.createElement(
                'td',
                null,
                result.Name
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'strong',
                  null,
                  'العنوان'
                ),
                ': ',
                result.Address,
                result.Phone1.length ? React.createElement(
                  'span',
                  null,
                  React.createElement('br', null),
                  React.createElement(
                    'strong',
                    null,
                    'تليفون 1: '
                  ),
                  result.Phone1
                ) : false,
                result.Phone2.length ? React.createElement(
                  'span',
                  null,
                  React.createElement('br', null),
                  React.createElement(
                    'strong',
                    null,
                    'تليفون 2: '
                  ),
                  result.Phone2
                ) : false
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'span',
                  { className: 'extra-info' },
                  React.createElement(
                    'strong',
                    null,
                    'النوع: '
                  ),
                  result.Type,
                  React.createElement('br', null),
                  React.createElement(
                    'strong',
                    null,
                    'التخصص: '
                  ),
                  result.Speciality
                )
              )
            );
          })
        )
      )
    );
  }
});

var SearchView = React.createClass({
  displayName: 'SearchView',

  getInitialState: function getInitialState() {
    return {
      results: []
    };
  },
  handleSearchResults: function handleSearchResults(results) {
    this.setState({ results: results });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'search-view' },
      React.createElement(SearchForm, _extends({}, this.props, { onSearchResults: this.handleSearchResults })),
      React.createElement(SearchResults, { results: this.state.results })
    );
  }
});
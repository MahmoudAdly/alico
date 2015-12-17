var SearchForm = React.createClass({
  getInitialState: function() {
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
    }
  },
  componentDidMount: function() {
    // get cities
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.citiesPath,
        dataType: 'json',
        cache: false,
        success: function(data) {
          self.setState({cities: data.data});
        }.bind(self),
        error: function(xhr, status, err) {
          console.error(self.props.citiesPath, status, err.toString());
        }.bind(self)
      });
    }, 10);

    // get types
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.typesPath,
        dataType: 'json',
        cache: false,
        success: function(data) {
          self.setState({types: data.data});
        }.bind(self),
        error: function(xhr, status, err) {
          console.error(self.props.typesPath, status, err.toString());
        }.bind(self)
      });
    }, 10);

    // get specialities
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.props.specialitiesPath,
        dataType: 'json',
        cache: false,
        success: function(data) {
          self.setState({specialities: data.data});
        }.bind(self),
        error: function(xhr, status, err) {
          console.error(self.props.specialitiesPath, status, err.toString());
        }.bind(self)
      });
    }, 10);
  },
  cityChanged: function(event) {
    this.setState({currentCity: event.target.value}, function() {
      // get districts
      $.ajax({
        url: this.props.districtsPath,
        dataType: 'json',
        data: {city: this.state.currentCity},
        cache: false,
        success: function(data) {
          this.setState({districts: data.data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.districtsPath, status, err.toString());
        }.bind(this)
      });
    });
  },
  districtChanged: function(event) {
    this.setState({currentDistrict: event.target.value});
  },
  typeChanged: function(event) {
    this.setState({currentType: event.target.value});
  },
  specialityChanged: function(event) {
    this.setState({currentSpeciality: event.target.value});
  },
  handleSearch: function(event) {
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
      success: function(data) {
        this.props.onSearchResults(data.data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.placesPath, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <form id="searchform" onSubmit={this.handleSearch}>
        {/*city*/}
        <div className="row">
            <div className="small-2 small-offset-1 columns">
                <label htmlFor="cityBox"><b>المدينة</b></label>
            </div>
            <div className="small-8 large-7 columns end">
                <select id="cityBox" name="city" value={this.state.currentCity} onChange={this.cityChanged}>
                  <option value=""></option>
                  {this.state.cities.map(function(city, idx){
                    return <option value={city} key={idx}>{city}</option>
                  })}
                </select>
            </div>
        </div>

        {/* district */}
        <div className="row">
            <div className="small-2 small-offset-1 columns">
                <label htmlFor="districtBox"><b>الحي</b></label>
            </div>
            <div className="small-8 large-7 columns end">
                <select id="districtBox" name="district" value={this.state.currentDistrict} onChange={this.districtChanged}>
                  {this.state.districts.map(function(district, idx){
                    return <option value={district} key={idx}>{district}</option>
                  })}
                </select>
            </div>
        </div>

        {/* type */}
        <div className="row">
            <div className="small-2 small-offset-1 columns">
                <label htmlFor="typeBox"><b>النوع<span className="red-text">*</span></b></label>
            </div>
            <div className="small-8 large-7 columns end">
                <select id="typeBox" name="type" value={this.state.currentType} onChange={this.typeChanged}>
                  <option value=""></option>
                  {this.state.types.map(function(type, idx){
                    return <option value={type} key={idx}>{type}</option>
                  })}
                </select>
            </div>
        </div>

        {/* speciality */}
        <div className="row">
            <div className="small-2 small-offset-1 columns">
                <label htmlFor="specialityBox"><b>التخصص<span className="red-text">*</span></b></label>
            </div>
            <div className="small-8 large-7 columns end">
                <select id="specialityBox" name="speciality" value={this.state.currentSpeciality} onChange={this.specialityChanged}>
                  <option value=""></option>
                  {this.state.specialities.map(function(speciality, idx){
                    return <option value={speciality} key={idx}>{speciality}</option>
                  })}
                </select>
            </div>
        </div>

        <div className="row">
            <div className="small-10 small-offset-1 columns end">
                <label className="red-text">* لا يشترط اختيار كليهما</label>
            </div>
        </div>
        <br />

        {/* search */}
        <div className="row">
          <div className="small-12 large-3 small-centered columns">
            <input id="submitsearch" className="button radius expand" type="submit" value="بحث" />
          </div>
        </div>
      </form>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    return (
      <div className="row">
        <table id="resultstable">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>معلومات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.results.map(function(result, idx) {
              return (
                <tr key={idx}>
                  <td>
                    {result.Name}
                  </td>
                  <td>
                    <strong>العنوان</strong>: {result.Address}
                    {(result.Phone1.length ? <span><br/><strong>تليفون 1: </strong>{result.Phone1}</span> : false)}
                    {(result.Phone2.length ? <span><br/><strong>تليفون 2: </strong>{result.Phone2}</span> : false)}
                  </td>
                  <td>
                    <span className="extra-info">
                      <strong>النوع: </strong>{result.Type}
                      <br/>
                      <strong>التخصص: </strong>{result.Speciality}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
});

var SearchView = React.createClass({
  getInitialState: function() {
    return {
      results: []
    }
  },
  handleSearchResults: function(results) {
    this.setState({results: results});
  },
  render: function() {
    return (
      <div className="search-view">
        <SearchForm {...this.props} onSearchResults={this.handleSearchResults} />
        <SearchResults results={this.state.results}/>
      </div>
    );
  }
});

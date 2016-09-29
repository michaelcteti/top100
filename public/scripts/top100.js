var TopCoursesTable = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      filterText: '',
      playedOnly: false
    };
  },

  handleUserInput: function(filterText, playedOnly) {
    this.setState({
      filterText: filterText,
      playedOnly: playedOnly
    });
  },

  handleListSelection: function(list, state) {
    this.setState({
      list: list,
      state: state
    });
  },

  loadCoursesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadCoursesFromServer();
    setInterval(this.loadCoursesFromServer, this.props.pollInterval);
  },

  handleCourseAdd: function(course) {
    var courses = this.state.data;
    var newCourses = courses.concat([course]);
    this.setState({data: newCourses});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: course,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: courses});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="topCoursesTable">
        <h2>Top Golf Courses</h2>
        <h4>Add New Course</h4>
        <CourseForm onCourseSubmit={this.handleCourseAdd} />
        <br />
        <SearchBar
          filterText={this.state.filterText}
          playedOnly={this.state.playedOnly}
          onUserInput={this.handleUserInput} />
        <br />
        <CourseSelection list={this.state.list} onUserInput={this.handleListSelection} />
        <CoursesList
          data={this.state.data}
          filterText={this.state.filterText}
          list={this.state.list}
          playedOnly={this.state.playedOnly}
          state={this.state.state} />
      </div>
    );
  }
});

var CourseForm = React.createClass({
  getInitialState: function() {
    return {us_rank: '', world_rank: '', public_rank: '', state_rank: '', name: '', location: '', architects: '', year: '', score: '', state: ''};
  },
  handleUsRankChange: function(e) {
    this.setState({us_rank: e.target.value});
  },
  handleWorldRankChange: function(e) {
    this.setState({world_rank: e.target.value});
  },
  handlePublicRankChange: function(e) {
    this.setState({public_rank: e.target.value});
  },
  handleStateRankChange: function(e) {
    this.setState({state_rank: e.target.value});
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleLocationChange: function(e) {
    this.setState({location: e.target.value});
  },
  handleArchitectsChange: function(e) {
    this.setState({architects: e.target.value});
  },
  handleYearChange: function(e) {
    this.setState({year: e.target.value});
  },
  handleScoreChange: function(e) {
    this.setState({score: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var us_rank = this.state.us_rank.trim();
    var world_rank = this.state.world_rank.trim();
    var public_rank = this.state.public_rank.trim();
    var state_rank = this.state.state_rank.trim();
    var name = this.state.name.trim();
    var location = this.state.location.trim();
    var architects = this.state.architects.trim();
    var year = this.state.year.trim();
    var score = this.state.score.trim();
    var state_initials = this.state.location.trim().match(/[^, ]*$/)[0]
    if (!name || !location) {
      return;
    }
    this.props.onCourseSubmit({us_rank: us_rank, world_rank: world_rank, public_rank, public_rank, state_rank: state_rank, name: name, location: location, architects: architects, year: year, score: score, state: state_initials});
    this.setState({us_rank: '', world_rank: '', public_rank: '', state_rank: '', name: '', location: '', architects: '', year: '', score: '', state: ''});
  },

  render: function() {
    return (
      <form className="courseForm" onSubmit={this.handleSubmit}>
        <input
          type="number"
          placeholder="US Rank"
          value={this.state.us_rank}
          onChange={this.handleUsRankChange} />
        <input
          type="number"
          placeholder="World Rank"
          value={this.state.world_rank}
          onChange={this.handleWorldRankChange} />
        <input
          type="number"
          placeholder="Public Rank"
          value={this.state.public_rank}
          onChange={this.handlePublicRankChange} />
        <input
          type="number"
          placeholder="State Rank"
          value={this.state.state_rank}
          onChange={this.handleStateRankChange} />
        <input
          type="text"
          placeholder="Name"
          value={this.state.name}
          onChange={this.handleNameChange} />
        <input
          type="text"
          placeholder="Location"
          value={this.state.location}
          onChange={this.handleLocationChange} />
        <input
          type="text"
          placeholder="Architects"
          value={this.state.architects}
          onChange={this.handleArchitectsChange} />
        <input
          type="text"
          placeholder="Year"
          value={this.state.year}
          onChange={this.handleYearChange} />
        <input
          type="number"
          placeholder="Best Score"
          value={this.state.score}
          onChange={this.handleScoreChange} />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var ScoreForm = React.createClass({
  getInitialState: function() {
    return {score: ''};
  },
  handleScoreChange: function(e) {
    this.setState({score: e.target.value});
  },
  updateScore: function(course) {
    $.ajax({
      url: '/api/top100',
      dataType: 'json',
      type: 'PATCH',
      data: course,
      success: function() {
        this.setState({score: ''});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({score: ''});
        console.error('/api/top100', status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var score = this.state.score.trim();
    var courseId = this.props.course.id;
    if (!score || !courseId) {
      return;
    }
    this.updateScore({id: courseId, score: score});
  },

  render: function() {
    return (
      <form className="scoreForm" onSubmit={this.handleSubmit}>
        <input
          type="number"
          placeholder="Score"
          value={this.state.score}
          onChange={this.handleScoreChange} />
        <input type="submit" value="Post" />
      </form>
    )
  }
});

var CoursesList = React.createClass({
  render: function() {
    var rows = []
    var us_count = 0
    var world_count = 0
    var public_count = 0
    this.props.data.forEach(function(course) {
      if (course.us_rank && course.score) {
        us_count += 1;
      }
      if (course.world_rank && course.score) {
        world_count += 1;
      }
      if (course.public_rank && course.score) {
        public_count += 1;
      }

      if (!this.props.list) {
        return;
      }
      if (course.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
        return;
      }
      if (!course.score && this.props.playedOnly) {
        return;
      }
      if (this.props.list == 'america' && !course.us_rank) {
        return;
      }
      if (this.props.list == 'world' && !course.world_rank) {
        return;
      }
      if (this.props.list == 'public' && !course.public_rank) {
        return;
      }
      if (this.props.list == 'state' && (!course.state_rank || this.props.state != course.state)){
        return;
      }

      if (this.props.list == 'america') {
        course.rank = course.us_rank;
      }
      if (this.props.list == 'world'){
        course.rank = course.world_rank;
      }
      if (this.props.list == 'public'){
        course.rank = course.public_rank;
      }
      if (this.props.list == 'state'){
        course.rank = course.state_rank;
      }

      rows.push(<CourseRow course={course} key={course.id} list={this.props.list} />);
      rows.sort(function(a, b) {
        return parseFloat(a.props.course.rank) - parseFloat(b.props.course.rank);
      });
    }.bind(this));

    return (
      <div className="coursesList">
        <p>America: {us_count}/200 &nbsp;&nbsp; World: {world_count}/100 &nbsp;&nbsp; Public: {public_count}/100</p>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Location</th>
              <th>Architect(s)</th>
              <th>Opening</th>
              <th>Best Score</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

var CourseRow = React.createClass({
  render: function() {
    var rank = this.props.course.us_rank
    if (this.props.list == 'america') {
      rank = this.props.course.us_rank;
    }
    if (this.props.list == 'world'){
      rank = this.props.course.world_rank;
    }
    if (this.props.list == 'public'){
      rank = this.props.course.public_rank;
    }
    if (this.props.list == 'state'){
      rank = this.props.course.state_rank;
    }
    return (
      <tr>
        <td>{rank}</td>
        <td>{this.props.course.name}</td>
        <td>{this.props.course.location}</td>
        <td>{this.props.course.architects}</td>
        <td>{this.props.course.year}</td>
        <td>{this.props.course.score}</td>
        <td><ScoreForm course={this.props.course} /></td>
      </tr>
    );
  }
});

var CourseSelection = React.createClass({
  handleChange: function() {
    var list = 'america'
    var state = this.refs.stateSelect.value
    if (this.refs.america.checked) {
      list = 'america';
    }
    if (this.refs.world.checked) {
      list = 'world';
    }
    if (this.refs.public.checked) {
      list = 'public';
    }
    if (this.refs.state.checked) {
      list = 'state';
    }
    this.props.onUserInput(
      list,
      state
    );
  },

  render: function() {
    return (
      <form>
        <input type="radio" name="list" ref="america" value="america" onChange={this.handleChange} /> America
        <input type="radio" name="list" ref="world" value="world" onChange={this.handleChange} /> World
        <input type="radio" name="list" ref="public" value="public" onChange={this.handleChange} /> Public
        <input type="radio" name="list" ref="state" value="state" onChange={this.handleChange} /> State
        <select name="stateSelect" ref="stateSelect" onChange={this.handleChange}>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </select>
      </form>
    )
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.playedOnlyInput.checked
    );
  },

  render: function() {
    return (
      <form>
        <h4>Search for a Course</h4>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange} />
        <p>
          <input
            type="checkbox"
            checked={this.props.playedOnly}
            ref="playedOnlyInput"
            onChange={this.handleChange} />
          {' '}
          Only show courses you have played
        </p>
      </form>
    );
  }
});

ReactDOM.render(
  <TopCoursesTable url="/api/top100" pollInterval={5000} />,
  document.getElementById('content')
);

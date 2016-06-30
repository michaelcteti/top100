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

  handleListSelection: function(list) {
    this.setState({
      list: list
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
        <form onClick={this.handleListSelection}>
          <input type="button" name="list" value="america"/>
          <input type="button" name="list" value="world" />
          <input type="button" name="list" value="public" />
        </form>
        <h4>Top 100 Courses</h4>
        <CoursesList
          data={this.state.data}
          filterText={this.state.filterText}
          playedOnly={this.state.playedOnly}/>
      </div>
    );
  }
});

var CourseForm = React.createClass({
  getInitialState: function() {
    return {us_rank: '', world_rank: '', name: '', location: '', architects: '', year: '', score: '', state: ''};
  },
  handleUsRankChange: function(e) {
    this.setState({us_rank: e.target.value});
  },
  handleWorldRankChange: function(e) {
    this.setState({world_rank: e.target.value});
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
    var name = this.state.name.trim();
    var location = this.state.location.trim();
    var architects = this.state.architects.trim();
    var year = this.state.year.trim();
    var score = this.state.score.trim();
    var state_initials = this.state.location.trim().match(/[^, ]*$/)[0]
    debugger
    if (!name || !location) {
      return;
    }
    this.props.onCourseSubmit({us_rank: us_rank, world_rank: world_rank, name: name, location: location, architects: architects, year: year, score: score, state: state_initials});
    this.setState({us_rank: '', world_rank: '', name: '', location: '', architects: '', year: '', score: '', state: ''});
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
          placeholder="Score"
          value={this.state.score}
          onChange={this.handleScoreChange} />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CoursesList = React.createClass({
  render: function() {
    var rows = []
    this.props.data.forEach(function(course) {
      if (course.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
        return;
      }
      if (!course.score && this.props.playedOnly) {
        return;
      }

      rows.push(<CourseRow course={course} key={course.id} />);
      rows.sort(function(a, b) {
        return parseFloat(a.props.course.us_rank) - parseFloat(b.props.course.us_rank);
      });
    }.bind(this));

    return (
      <div className="coursesList">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Location</th>
              <th>Architect(s)</th>
              <th>Opening</th>
              <th>Score</th>
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
    return (
      <tr>
        <td>{this.props.course.us_rank}</td>
        <td>{this.props.course.name}</td>
        <td>{this.props.course.location}</td>
        <td>{this.props.course.architects}</td>
        <td>{this.props.course.year}</td>
        <td>{this.props.course.score}</td>
      </tr>
    );
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
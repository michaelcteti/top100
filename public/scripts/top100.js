var TopCoursesTable = React.createClass({
  getInitialState: function() {
    return {data: []};
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
        <h2>Top 100 Courses in America</h2>
        <CoursesList data={this.state.data} />
        <br />
        <h4>Add New Course</h4>
        <CourseForm onCourseSubmit={this.handleCourseAdd} />
      </div>
    );
  }
});

var CourseForm = React.createClass({
  getInitialState: function() {
    return {id: '', name: '', location: '', architects: '', year: '', played: '', score: ''};
  },
  handleIdChange: function(e) {
    this.setState({id: e.target.value});
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
  handlePlayedChange: function(e) {
    this.setState({played: e.target.value});
  },
  handleScoreChange: function(e) {
    this.setState({score: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var id = this.state.id.trim();
    var name = this.state.name.trim();
    var location = this.state.location.trim();
    var architects = this.state.architects.trim();
    var year = this.state.year.trim();
    var played = this.state.played.trim();
    var score = this.state.score.trim();
    if (!id || !name || !location) {
      return;
    }
    this.props.onCourseSubmit({id: id, name: name, location: location, architects: architects, year: year, played: played, score: score});
    this.setState({id: '', name: '', location: '', architects: '', year: '', played: '', score: ''});
  },

  render: function() {
    return (
      <form className="courseForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Rank"
          value={parseInt(this.state.id)}
          onChange={this.handleIdChange} />
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
          type="text"
          placeholder="Played"
          value={this.state.played}
          onChange={this.handlePlayedChange} />
        <input
          type="text"
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
      rows.push(<CourseRow course={course} key={course.id} />);
    });

    return (
      <div className="coursesList">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Location</th>
              <th>Architect(s)</th>
              <th>Year Opened</th>
              <th>Played</th>
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
        <td>{this.props.course.id}</td>
        <td>{this.props.course.name}</td>
        <td>{this.props.course.location}</td>
        <td>{this.props.course.architects}</td>
        <td>{this.props.course.year}</td>
        <td>{this.props.course.played}</td>
        <td>{this.props.course.score}</td>
      </tr>
    );
  }
});

ReactDOM.render(
  <TopCoursesTable url="/api/top100" pollInterval={2000} />,
  document.getElementById('content')
);
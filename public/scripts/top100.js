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

  render: function() {
    return (
      <div className="topCoursesTable">
        <h2>Top 100 Courses in America</h2>
        <CoursesList data={this.state.data} />
      </div>
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
  <TopCoursesTable url="/api/top100" pollInterval={2000}/>,
  document.getElementById('content')
);
var courses = [
  {
      "id": 1,
      "name": "Augusta National G.C.",
      "location": "Augusta, GA",
      "architects": "Mackenzie & Jones",
      "year": "1933",
      "played": null,
      "score": null
  },
  {
      "id": 2,
      "name": "Pine Valley G.C.",
      "location": "Pine Valley, NJ",
      "architects": "Crump & Colt",
      "year": "1918",
      "played": null,
      "score": null
  },
  {
      "id": 19,
      "name": "The Country Club",
      "location": "Chestnut Hill, MA",
      "architects": "Campbell & Campbell",
      "year": "1895",
      "played": "Yes",
      "score": 95
  }
]

var TopCoursesTable = React.createClass({
  render: function() {
    return (
      <div className="topCoursesTable">
        <h2>Top 100 Courses in America</h2>
        <CoursesList data={this.props.data} />
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
  <TopCoursesTable data={courses} />,
  document.getElementById('content')
);
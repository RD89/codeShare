import React, { Component } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";
import "../styles/sidebar.css";
import "../styles/roomUltilisation.css";
import ChartGridline from "./chartGridline";
import sampleData from "../ultilisation-by-class-MatA.json";
import sampleDataWeek from "../byClass-withWeek.json";
import sampleDataWeekB from "../byClass-withWeekB.json";

var dataArrayA = [];
var dataArrayB = [];

for (var item in sampleDataWeek) {
  dataArrayA.push([
    sampleDataWeek[item].week,
    sampleDataWeek[item].occupancy,
    sampleDataWeek[item].capacity
  ]);
}

for (var item in sampleDataWeekB) {
  dataArrayB.push([
    sampleDataWeekB[item].week,
    sampleDataWeekB[item].occupancy,
    sampleDataWeekB[item].capacity
  ]);
}

class RoomUltilisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      selectedClass: "LectureA",
      selectedCourse: "COMP9517",
      counter: 0 //dummy prop
    };

    this.classOptions = [
      { value: 0, label: "LectureA" },
      { value: 1, label: "LectureB" }
    ];

    this.courseOptions = [
      { value: 0, label: "COMP9517" },
      { value: 1, label: "ARTS2663" }
    ];

    this.handleChange = this.handleChange.bind(this);
    this.addData = this.addData.bind(this);
  }

  componentDidMount() {
    // const url = "https://github.com/RD89/mockdata/blob/master/linegraph.json";
    // fetch(url, { mode: "no-cors" })
    //   .then(response => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error("something went wrong");
    //     }
    //   })
    //   .then(response =>
    //     this.setState({
    //       data: response,
    //       loading: false
    //     })
    //   );

    //convert json to array
    // console.log(sampleData);
    // var dataArray = [];

    // for (var item in sampleData) {
    //   dataArray.push([x: sampleData[item].timestamp, y: sampleData[item].occupancy]);
    // }
    // console.log(dataArray);

    if (this.state.selectedClass === "LectureA") {
      this.setState({
        data: dataArrayA
      });
    }
    this.setState({
      loading: false
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props === nextProps && this.state === nextState ? false : true;
  // }

  handleChange = event => {
    this.setState(
      {
        [event.target.id]: event.target.value
      },
      () => {}
    );

    console.log("2/ this.state.selectedClass: " + event.target.value); //since there's a bit of delay with setState

    if (this.state.selectedClass === "LectureA") {
      this.setState(
        {
          data: dataArrayA
        },
        () => {}
      );
    } else if (this.state.selectedClass === "LectureB") {
      this.setState(
        {
          data: dataArrayB
        },
        () => {}
      );
    }

    //console.log("handleChange| " + event.target.id + ": " + event.target.value); //dynamically get target ID
  };

  addData() {
    if (this.state.selectedClass === "LectureA") {
      dataArrayA.push([
        // sampleDataWeek[13].week++,
        // sampleDataWeek[13].occupancy++,
        // sampleDataWeek[13].capacity
        15,
        200,
        0
      ]);
      this.setState({ data: dataArrayA }, () => {
        console.log("addData: " + this.state.data);
      });
    }
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <React.Fragment>
          <NavBar />
          <SideBar />
          <div id="page-wrap">
            <h1 style={{ padding: 20 }}>Class Attendance</h1>
            <div>Loading Chart ....</div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <NavBar />
        <SideBar />
        <div id="page-wrap">
          <h1 style={{ padding: 20 }}>Class Attendance</h1>

          <label htmlFor="course" style={this.textAreaStyle}>
            Select course
          </label>
          <select
            id="selectedCourse"
            value={this.state.selectedCourse ? this.state.selectedCourse : ""}
            onChange={this.handleChange}
          >
            {this.courseOptions.map((e, key) => {
              return (
                <option key={key} value={e.label}>
                  {e.label}
                </option>
              );
            })}
          </select>

          <label htmlFor="class" style={this.textAreaStyle}>
            Select class
          </label>

          <select
            id="selectedClass"
            value={this.state.selectedClass ? this.state.selectedClass : ""}
            onChange={this.handleChange}
          >
            {this.classOptions.map((e, key) => {
              return (
                <option key={key} value={e.label}>
                  {e.label}
                </option>
              );
            })}
          </select>

          {/* <button onClick={this.addData}>Add data</button> */}

          <div id="chart-wrap">
            <ChartGridline
              data={this.state.data}
              //  key={++this.state.counter}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RoomUltilisation;

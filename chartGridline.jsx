import React, { Component } from "react";

import {
  XYPlot,
  XAxis,
  YAxis,
  LineMarkSeries,
  DiscreteColorLegend,
  Hint
} from "react-vis";
import "react-vis/dist/style.css";
import HintContent from "./hintContent.js";

import debounce from "debounce"; //postpone state change

var bgColors = {
  Default: "#81b71a", //green
  Blue: "#00B1E1",
  Cyan: "#37BC9B",
  Green: "#8CC152",
  Red: "#E9573F",
  Yellow: "#F6BB42"
};

// const data = [
//   [1, 2.3, 1.3],
//   [2, 2.4, 1.7],
//   [3, 2.9, 1.9],
//   [4, 3.3, 1.7],
//   [5, 6.6, 1.7],
//   [6, 16.3, 4],
//   [7, 13.1, 5.5],
//   [8, 25.1, 5.8],
//   [9, 11.9, 5.6],
//   [10, 19.5, 5.9]
// ];

class ChartGridline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightSeries: null,
      highlightTip: null,
      receivedData: null,
      loading: true,
      data: null,
      value: null //value of mark?
    };
    this.translatedArray = [];
    this.debouncedSetState = debounce(newState => this.setState(newState), 40);
    this._rememberValue = this._rememberValue.bind(this);
    this._forgetValue = this._forgetValue.bind(this);
  }

  async componentDidMount() {
    //This translate the data points into x and y formats
    // var series1 = [3, 1].map(i =>
    //   this.props.data.map(d => ({ x: new Date(d[0]), y: d[1], capacity: d[2] }))
    // );
    // series2 = [2, 1].map(i => this.props.data.map(d => ({ x: d[0], y: d[2] })));

    // series1 = [2, 1].map(i =>
    //   this.props.data.map(d => ({ x: d.week, y: d.val1 }, console.log(d)))
    // );
    // console.log(series1);

    // this.setState({ series1 });
    await this.translateSeries(this.props.data);
    this.setState({ loading: false });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   // Are we serving the chart?
  //   // Capture the scroll position so we can adjust scroll later.
  //   var loading = null;
  //   if (prevProps.data !== this.props.data) {
  //     loading = true;
  //     return loading;
  //   }
  //   loading = false;
  //   return loading;
  // }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps.data)) {
      console.log("state has changed!");
      await this.translateSeries(this.props.data);
    }
    // if (snapshot.loading) {
    //   console.log("computing....!");
    // }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.data !== prevState.data) {
  //     console.log("props changed. Return an object to change state");
  //     return {
  //       receivedData: nextProps.data
  //     };
  //   }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log("this.props.data " + this.props.data);
  //   console.log("prevProps.data: " + prevProps.data);

  //   if (this.state.receivedData !== prevState.receivedData) {
  //     // state has change!! Do some side effect as you wish
  //     console.log("state has changed!");
  //     this.translateSeries(this.props.data);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.data !== nextState.data) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  async translateSeries(data) {
    this.translatedArray = [1].map(i =>
      data.map(d => ({
        x: new Date(d[0]),
        y: d[1],
        capacity: d[2]
      }))
    );

    console.log("translated function: " + JSON.stringify(this.translatedArray));
  }

  _rememberValue(value) {
    this.setState({ value });
  }

  _forgetValue() {
    this.setState({ value: null });
  }

  axisProps = {
    tickSizeInner: 0,
    style: { line: { stroke: "#939393", strokeWidth: "1px" } }
  };

  hintStyle = {
    fontSize: 14,
    color: "black",
    background: "#faffe6",
    borderRadius: "5px",
    border: "3px solid #fff"
  };

  render() {
    const { highlightSeries, loading, value } = this.state;
    console.log("render method is called");

    if (loading) {
      return (
        <React.Fragment>
          <div>loading...</div>
        </React.Fragment>
      );
    }

    return (
      <div>
        <DiscreteColorLegend
          // items={["Attendance", "Enrolment"]}
          items={["Attendance"]}
          orientation="horizontal"
          // style={{ position: "absolute", textAlign: "left", right: "25%" }}

          strokeWidth="3px"
        />
        <XYPlot
          xDomain={[0, 20]}
          key="1"
          width={600}
          height={600}
          onMouseLeave={() => this.setState({ highlightTip: null })}
        >
          <XAxis
            title="semester week"
            {...this.axisProps}
            tickFormat={String}
          />
          <YAxis
            title="occupancy"
            {...this.axisProps}
            // tickFormat={d => d + "%"}
            tickFormat={d => d}
          />

          {this.translatedArray.map((d, i) => (
            <LineMarkSeries
              key={i}
              size={3}
              data={d}
              onValueMouseOver={this._rememberValue}
              onValueMouseOut={this._forgetValue}
              onSeriesMouseOver={() =>
                this.debouncedSetState(
                  { highlightSeries: d },
                  console.log("highlighted")
                )
              }
              onSeriesMouseOut={() =>
                this.debouncedSetState({
                  highlightSeries: null
                })
              }
              stroke={d === highlightSeries ? "black" : bgColors.Blue}
            />
          ))}
          {console.log("this.translatedArray: " + this.translatedArray)}

          {value ? (
            <Hint value={value} style={this.hintStyle}>
              <HintContent value={value} />
            </Hint>
          ) : null}
        </XYPlot>
      </div>
    );
  }
}
export default ChartGridline;

// import React from "react";
// import {
//   XYPlot,
//   XAxis,
//   YAxis,
//   VerticalGridLines,
//   HorizontalGridLines,
//   LineSeries
// } from "react-vis";

// const Chart = props => {
//   const dataArr = props.data.map(d => {
//     return { x: d.year + "/" + d.quarter, y: parseFloat(d.count / 1000) };
//   });

//   return (
//     <XYPlot xType="ordinal" width={1000} height={500}>
//       <VerticalGridLines />
//       <HorizontalGridLines />
//       <XAxis title="Period of time(year and quarter)" />
//       <YAxis title="Number of pull requests (thousands)" />
//       <LineSeries data={dataArr} style={{ stroke: "violet", strokeWidth: 3 }} />
//     </XYPlot>
//   );
// };

// export default Chart;

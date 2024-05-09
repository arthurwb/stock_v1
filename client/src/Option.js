import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import Chart from "chart.js/auto";

class Option extends React.Component {
  chartRef = React.createRef();
  chartInstance = null;

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.destroyChart();
    this.renderChart();
  }

  componentWillUnmount() {
    this.destroyChart();
  }

  renderChart() {
    const { option, differences } = this.props;
    const diff = differences[option.name];
  
    const ctx = this.chartRef.current.getContext("2d");
    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(Array(option.historicalPrices.length).keys()),
        datasets: [
          {
            label: "Historical Prices",
            data: option.historicalPrices,
            backgroundColor: "rgba(255, 255, 255, 0)", // Transparent background for the line
            borderWidth: 4, // Increase line width for visibility
            pointBackgroundColor: option.historicalPrices.map((price, index) => {
                return option.historicalPrices[index] > option.historicalPrices[index - 1] ? "green" : "red";
            }),
          },
        ],
      },
      options: {
        animation: false, // Disable animations
      },
    });
  }

  destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  render() {
    const { option, prevOption, differences } = this.props;
    const diff = prevOption && differences[option.name]; // Retrieve difference from differences object based on option name

    return (
      <div className="row option">
        <div className="col-md-4">
          <p>Name: {option.name}</p>
        </div>
        <div className="col-md-4">
            {
                diff ? (
                    <FontAwesomeIcon icon={faCircleUp} color="green" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleDown} color="red" />
                  )
            }
        </div>
        <div className="col-md-4">
          <p>Price: {option.price}</p>
        </div>
        <canvas className="graph" ref={this.chartRef} />
      </div>
    );
  }
}

export default Option;

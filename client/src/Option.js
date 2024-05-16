import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import Chart from "chart.js/auto";

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderCheck: this.props.renderCheck,
    };
  }

  chartRef = React.createRef();
  chartInstance = null;

  componentDidMount() {
    if (this.state.renderCheck) {
      this.renderChart();
    }
  }

  componentDidUpdate() {
    if (this.state.renderCheck) {
      this.destroyChart();
      this.renderChart();
    }
  }

  componentWillUnmount() {
    if (this.state.renderCheck) {
      this.destroyChart();
    }
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
            pointBackgroundColor: option.historicalPrices.map(
              (price, index) => {
                return option.historicalPrices[index] >
                  option.historicalPrices[index - 1]
                  ? "green"
                  : "red";
              }
            ),
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
    const { option, renderCheck } = this.props;

    return (
      <div className="row">
        <div className="col-md-4">
          <p>Name: {option.name}</p>
        </div>
        <div className="col-md-4">
          {option.historicalPrices[99] > option.historicalPrices[98] ? (
            <FontAwesomeIcon icon={faCircleUp} color="green" />
          ) : (
            <FontAwesomeIcon icon={faCircleDown} color="red" />
          )}
        </div>
        <div className="col-md-4">
          <div style={{display: "flex", alignItems: "center" }}>
            {option.historicalPrices
              .slice(90, 101)
              .reverse() // Reverse the array
              .map((price, index, prices) => (
                <p
                  key={index}
                  style={{
                    fontSize: `${100 - index * 5}%`, // Decreasing font size
                    opacity: `${1 - index * 0.1}`, // Decreasing opacity
                    marginRight: "5px", // Adding some space between prices
                    color:
                      price > prices[index + 1] ? "green" : "red", // Compare with the previous price
                  }}
                >
                  {price} &#8592;
                </p>
              ))}
          </div>
        </div>
          {renderCheck ? <canvas className="graph" ref={this.chartRef} /> : <></>}
      </div>
    );
  }
}

export default Option;

import React, { useRef, useEffect } from "react";
import { Navigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import Chart from "chart.js/auto";

import { fetchData, calculateDifferences, formatedCookie, getOptionWallet } from "./util/CalcData"; // Import fetchData and calculateDifferences functions

class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderCheck: this.props.renderCheck,
      renderLength: this.props.renderLength,
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
    let last100Prices = option.historicalPrices.slice(-this.props.renderLength); // Get the last 100 items of the array

    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(Array(last100Prices.length).keys()), // Update labels to reflect the last 100 items
        datasets: [
          {
            label: "Historical Prices",
            data: last100Prices, // Use last 100 items here
            backgroundColor: "rgba(255, 255, 255, 0)", // Transparent background for the line
            borderWidth: 4, // Increase line width for visibility
            pointBackgroundColor: last100Prices.map((price, index) => {
              return last100Prices[index] > last100Prices[index - 1]
                ? "green"
                : "red";
            }),
          },
        ],
      },
      options: {
        animation: false, // Disable animations
        scales: {
          x: {
            display: false, // Hide x-axis
          },
        },
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

    if (!formatedCookie(document.cookie).username) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="row">
        <div className="col-md-6">
          <p>Name: {option.name}</p>
        </div>
        <div className="col-md-6">
          {option.historicalPrices[option.historicalPrices.length - 1] >
          option.historicalPrices[option.historicalPrices.length - 2] ? (
            <FontAwesomeIcon icon={faCircleUp} color="green" />
          ) : (
            <FontAwesomeIcon icon={faCircleDown} color="red" />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "80%",
            margin: "auto",
          }}
        >
          {option.historicalPrices
            .slice(
              option.historicalPrices.length - 20,
              option.historicalPrices.length
            )
            .reverse() // Reverse the array
            .map((price, index, prices) => (
              <p
                key={index}
                style={{
                  // fontSize: `${100 - index * 2}%`, // Decreasing font size
                  opacity: `${1 - index * 0.05}`, // Decreasing opacity
                  marginRight: "10px", // Increase horizontal space between prices
                  marginBottom: "10px", // Add vertical space between prices
                  color: price > prices[index + 1] ? "green" : "red", // Compare with the previous price
                  fontWeight: index == 0 ? "bold" : ""
                }}
              >
                {price} &#8592;
              </p>
            ))}
        </div>
        {renderCheck ? <canvas className="graph" ref={this.chartRef} /> : <></>}
      </div>
    );
  }
}

export default Option;

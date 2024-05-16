import React, { Component } from "react";
import Option from "./Option";
import { fetchData, calculateDifferences } from "./util/CalcData";

class OptionData extends Component {
  state = {
    data: null,
    prevData: null,
    differences: {},
    renderLength: 100,
  };

  componentDidMount() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  fetchData = () => {
    fetchData().then((optionData) => {
      this.setState((prevState) => ({
        prevData: prevState.data,
        data: optionData,
        differences: calculateDifferences(prevState.data, optionData),
      }));
    });
  };

  renderLengthClick = () => {
    this.state.renderLength == 100
      ? this.setState({ renderLength: 500 })
      : this.setState({ renderLength: 100 })
  };

  render() {
    const optionNameFromUrl = window.location.pathname.split("/")[2];
    const { data, prevData, differences } = this.state;

    // Filter the options array to find the option that matches the one specified in the URL
    const matchedOption =
      data && data.options.find((option) => option.name === optionNameFromUrl);

    return (
      <div className="Data">
        <header className="Data-header">{optionNameFromUrl}</header>
        <a href="/">Home</a>
        {matchedOption && (
          <div key={matchedOption.name}>
            <Option
              key={matchedOption.name}
              option={matchedOption}
              prevOption={
                prevData &&
                prevData.options.find(
                  (prevOption) => prevOption.name === matchedOption.name
                )
              }
              differences={differences}
              renderCheck={true}
              renderLength={this.state.renderLength}
            />
          </div>
        )}
        <div>
          <div>
            <button onClick={this.renderLengthClick}>Change State</button>
            <p>Current State: {this.state.renderLength}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default OptionData;

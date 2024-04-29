import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  state = {
    data: null,
    prevData: null,
    difference: null
  };

  componentDidMount() {
    this.fetchData(); // Fetch initial data
    this.intervalId = setInterval(this.fetchData, 5000); // Set interval to fetch data every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.intervalId); // Clear interval when component unmounts
  }

  fetchData = () => {
    fetch("/api")
      .then((res) => res.json())
      .then((optionData) => {
        this.setState((prevState) => ({
          prevData: prevState.data,
          data: optionData
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  difference = () => {
    let optionDiffs = [];
    this.state.data.options.forEach(option => {
      this.state.prevData.options.forEach(prevOption => {
        if (prevOption.name == option.name) {
          optionDiffs.push({name: option.name, diff: option.price > prevOption.price});
        }
      });
    });
    console.log(optionDiffs);
    return optionDiffs;
  }

  render() {
    const { data, prevData } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{!data ? "Loading..." : data.message}</p>
          <p>{!data ? "" : data.options[0].price}</p>
          <p>{!prevData ? "" : prevData.options[0].price} - {
            data != null && prevData != null ? this.difference()[0].diff.toString() : ""
          }</p>
        </header>
      </div>
    );
  }
}

export default App;

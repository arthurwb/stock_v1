import React from "react";
import Option from "./Option"; // Import the Option component
import "./css/app.css"; // Import CSS file

class App extends React.Component {
  state = {
    data: null,
    prevData: null,
    differences: {}
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
          data: optionData,
          differences: this.calculateDifferences(prevState.data, optionData)
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  calculateDifferences = (prevData, newData) => {
    if (!prevData || !newData) return {};

    const differences = {};
    newData.options.forEach(newOption => {
      prevData.options.forEach(prevOption => {
        if (prevOption.name === newOption.name) {
          differences[newOption.name] = newOption.price > prevOption.price;
        }
      });
    });
    return differences;
  }

  render() {
    const { data, prevData, differences } = this.state;

    return (
      <div className="App">
        <header className="App-header">Welcome</header>
          <p>{!data ? "Loading..." : data.message}</p>
          {data && data.options.map(option => (
            <Option
              key={option.name}
              option={option}
              prevOption={prevData && prevData.options.find(prevOption => prevOption.name === option.name)}
              differences={differences}
            />
          ))}
      </div>
    );
  }
}

export default App;

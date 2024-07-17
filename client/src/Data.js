import React, { Component } from "react";
import { Navigate  } from 'react-router-dom';

import Option from "./Option";
import { fetchData, calculateDifferences, formatedCookie, getUserData } from "./util/CalcData"; // Import fetchData and calculateDifferences functions

class Data extends Component {
  state = {
    userData: "",
    data: null,
    prevData: null,
    differences: {},
  };

  componentDidMount() {
    this.setUserData();
    this.fetchData(); // Fetch initial data
    this.intervalId = setInterval(this.fetchData, 5000); // Set interval to fetch data every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.intervalId); // Clear interval when component unmounts
  }
  
  setUserData = async () => {
    const userData = await getUserData(formatedCookie(document.cookie).username);
    this.setState(() => ({
      userData: userData
    }));
    return await getUserData(formatedCookie(document.cookie).username);
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

  render() {
    const { data, prevData, differences } = this.state;

    if (!formatedCookie(document.cookie).username) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="Data">
        <header className="Data-header">Welcome {formatedCookie(document.cookie).username} --- Wallet: {this.state.userData.wallet}</header>
        <a href="/about-us">About Us</a>
        <p>{!data ? "Loading..." : data.message}</p>
        {data &&
          data.options.map((option) => (
            <div className="option" key={option.name}>
              <h2>
                <a
                  style={
                    option.historicalPrices[option.historicalPrices.length - 1] > option.historicalPrices[option.historicalPrices.length - 2]
                      ? { color: "green" }
                      : { color: "red" }
                  }
                  href={`/data/${option.name}`}
                >
                  {option.name}
                </a>
              </h2>
              <Option
                key={option.name}
                option={option}
                prevOption={
                  prevData &&
                  prevData.options.find(
                    (prevOption) => prevOption.name === option.name
                  )
                }
                differences={differences}
                renderCheck={false}
                renderLength={100}
              />
            </div>
          ))}
      </div>
    );
  }
}

export default Data;

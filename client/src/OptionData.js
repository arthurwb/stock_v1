import React, { Component } from "react";
import Option from "./Option";
import BuyComponent from "./components/BuyComponent";
import SellComponent from "./components/SellComponent";
import { fetchData, calculateDifferences, formatedCookie, getUserData } from "./util/CalcData";

class OptionData extends Component {
  state = {
    userData: "",
    data: null,
    prevData: null,
    differences: {},
    renderLength: 100,
    purchaseAmount: 0
  };

  componentDidMount() {
    this.setUserData();
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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

  renderLengthClick = () => {
    switch (this.state.renderLength) {
      case 100:
        this.setState({ renderLength: 200 })
        break;
      case 200:
        this.setState({ renderLength: 500 })
        break;
      case 500:
        this.setState({ renderLength: 100 })
        break;
    }
  };

  updateAmount(amount) {
    const data = amount.nativeEvent.data;
    this.purchaseAmount = data;
    console.log(this.purchaseAmount);
  }

  buy(option, amount) {
    const username = formatedCookie(document.cookie).username;
    fetch(`/buy/${option.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        amount: amount
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    alert(option.name);
  };

  render() {
    const optionNameFromUrl = window.location.pathname.split("/")[2];
    const { data, prevData, differences } = this.state;

    // Filter the options array to find the option that matches the one specified in the URL
    const matchedOption =
      data && data.options.find((option) => option.name === optionNameFromUrl);

    return (
      <div className="Data">
        <header className="Data-header">{optionNameFromUrl} - Wallet: {this.state.userData.wallet}</header>
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
            <BuyComponent option={optionNameFromUrl}></BuyComponent>
            <SellComponent option={optionNameFromUrl}></SellComponent>
          </div>
        </div>
      </div>
    );
  }
}

export default OptionData;

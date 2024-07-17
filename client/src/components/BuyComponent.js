import React, { Component } from "react";
import { fetchData, calculateDifferences, formatedCookie } from "../util/CalcData";

class BuyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "0",
    };
  }

  // Handler for input change
  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  // Handler for button click
  handleBuyClick = () => {
    this.buy(this.state.inputValue);
  };

  // Dummy buy function for demonstration
  buy(amount) {
    console.log(this.props.option + " " + amount);
    const username = formatedCookie(document.cookie).username;
    fetch(`/buy/${this.props.option}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        amount: parseInt(amount),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    alert(this.props.option + " " + amount);
  }

  render() {
    return (
      <div>
        <input
          name="myInput"
          defaultValue="0"
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleBuyClick}>Buy</button>
      </div>
    );
  }
}

export default BuyComponent;

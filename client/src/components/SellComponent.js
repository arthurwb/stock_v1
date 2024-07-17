import React, { Component } from "react";
import { fetchData, calculateDifferences, formatedCookie } from "../util/CalcData";

class SellComponent extends Component {
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
    this.sell(this.state.inputValue);
  };

  // Dummy buy function for demonstration
  sell(amount) {
    console.log(this.props.option + " " + amount);
    const username = formatedCookie(document.cookie).username;
    fetch(`/sell/${this.props.option}`, {
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
        data.success ? alert(this.props.option + " " + amount) : alert("error");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  render() {
    return (
      <div>
        <input
          name="myInput"
          defaultValue="0"
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleBuyClick}>Sell</button>
      </div>
    );
  }
}

export default SellComponent;

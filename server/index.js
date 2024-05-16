const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Options = require("./models/option");

dotenv.config();

const app = express();

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.URI);
    console.log("Connected to db!");

    const interval = setInterval(await tickUpdateOptions, 5000);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/api", async (req, res) => {
    const options = await Options.find();
    res.json({ message: "Connected to Database", options: options });
});

async function tickUpdateOptions() {
  try {
    const optionsToUpdate = ["google", "microsoft", "amazon"];

    for (const optionName of optionsToUpdate) {
      const option = await Options.findOne({ name: optionName });

      if (!option) {
        console.log(`Option '${optionName}' not found`);
        continue;
      }

      const changeAmount = Math.floor(Math.random() * 11) - 5;
      option.price += changeAmount;

      console.log(option.historicalPrices);

      if (!option.historicalPrices) {
        option.historicalPrices = [option.price];
      } else {
        option.historicalPrices.push(option.price);
        
        const maxSize = 500;
        if (option.historicalPrices.length > maxSize) {
          option.historicalPrices.shift();
        }
      }

      await option.save();

      // console.log(`Option '${optionName}' updated: ${option.price}`);
    }
  } catch (error) {
    console.log("Internal Server Error: " + error);
  }
}

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const Options = require("./models/option");
const Users = require("./models/users");

dotenv.config();

const app = express();
app.use(bodyParser.json()); 

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

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ username, password }).exec();
    if (user) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/createUser', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ username }).exec();
    if (existingUser) {
      res.json({ success: false, message: 'User already exists' });
    } else {
      // Create new user
      const newUser = new Users({ username, password });
      await newUser.save();
      res.json({ success: true, message: 'User created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
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

      console.log(
        option.name + ": " + option.historicalPrices.slice(-5).reverse()
      );

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
    console.log("----");
  } catch (error) {
    console.log("Internal Server Error: " + error);
  }
}

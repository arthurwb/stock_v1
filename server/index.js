const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const Options = require("./models/option");
const Users = require("./models/users");
const { tickUpdateOptions, anotherUtilityFunction } = require("./util");

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
  const { username, password, carrots } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ username }).exec();
    if (existingUser) {
      res.json({ success: false, message: 'User already exists' });
    } else {
      // Create new user
      const newUser = new Users({ username, password, carrots });
      await newUser.save();
      res.json({ success: true, message: 'User created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/buy/:option', async (req, res) => {
  const { username, amount } = req.body;
  const { option } = req.params;

  try {
    console.log(username);
    const user = await Users.findOne({ username }).exec();
    if (!user) {
      res.status(404).json({ success: false, message: `User '${username}' not found` });
      return;
    }
    console.log("user found: " + user);

    // Find the option by name
    const optionToAdd = await Options.findOne({ name: option }).exec();
    if (!optionToAdd) {
      res.status(404).json({ success: false, message: `Option '${option}' not found` });
      return;
    }
    console.log("option found: " + optionToAdd.name);

    let optionFound = false;
    user.carrots.forEach((value, key) => {
      console.log(value);
      if (key == optionToAdd.name) {
        user.carrots.set(key, (value + amount));
        optionFound = true;
      }
    });

    if (!optionFound) {
      user.carrots.set(optionToAdd.name, amount)
    }

    console.log("bef save:"+user);
    // Save the updated user object
    await user.save();

    res.json({ success: true, message: `Option '${option}' added to carrots`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/sell/:option', async (req, res) => {
  const { username, amount } = req.body;
  const { option } = req.params;

  try {
    console.log(username);
    const user = await Users.findOne({ username }).exec();
    if (!user) {
      res.status(404).json({ success: false, message: `User '${username}' not found` });
      return;
    }
    console.log("user found: " + user);

    // Find the option by name
    const optionToSell = await Options.findOne({ name: option }).exec();
    if (!optionToSell) {
      res.status(404).json({ success: false, message: `Option '${option}' not found` });
      return;
    }
    console.log("option found: " + optionToSell.name);

    let optionFound = false;
    user.carrots.forEach((value, key) => {
      console.log(value);
      if (key == optionToSell.name) {
        if (value < amount) {
          res.status(400).json({ success: false, message: `Not enough '${option}' to sell` });
          optionFound = true; // Option was found but not enough to sell
          return;
        }
        user.carrots.set(key, (value - amount));
        optionFound = true;
      }
    });

    if (!optionFound) {
      res.status(400).json({ success: false, message: `Option '${option}' not found in user's carrots` });
      return;
    }

    console.log("bef save:"+user);
    // Save the updated user object
    await user.save();

    // res.json({ success: true, message: `Option '${option}' sold from carrots`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
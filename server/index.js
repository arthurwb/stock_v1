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
  const { username } = req.body;
  const { option } = req.params;

  try {
    console.log(username);
    const user = await Users.findOne({ username }).exec();
    console.log("user found: " + user);

    // Find the option by name
    const optionToAdd = await Options.findOne({ name: option }).exec();
    if (!optionToAdd) {
      res.status(404).json({ success: false, message: `Option '${option}' not found` });
      return;
    }
    console.log("option found: " + optionToAdd.name);

    // Add the option to the user's carrots array
    user.carrots.push(optionToAdd.name); // Assuming `carrots` is an array of option IDs
    console.log(optionToAdd.name);
    await user.save();

    res.json({ success: true, message: `Option '${option}' added to carrots`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
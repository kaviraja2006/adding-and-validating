const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
require('dotenv').config();
const User = require('./schema');
const { error } = require('console');
const app = express();
const port = 3010;
app.use(express.json()); // Fix: express.json is a function
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))
mongoose.connect(process.env.MONGO)
.then(()=>{
  console.log('connected to database successfully')
})
.catch((err)=>{
  console.log(err)
})
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
app.post('/register', async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const user = new User({ name, email, pass});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: "user data is not saved" });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ 
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

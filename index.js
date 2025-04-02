const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose')
require('dotenv').config();
const User=require('./schema');
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
// Add this route before app.listen
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch users" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

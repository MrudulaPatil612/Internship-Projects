const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [
  { username: "testuser", password: "123456" } // Predefined user
];

// Sign Up route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (username.length < 3 || password.length < 6) {
    return res.status(400).json({
      message: "Username must be at least 3 characters and password at least 6 characters.",
    });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already taken." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Signup successful!" });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (user) {
    return res.status(200).json({ message: "Login successful!" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // You can later store this in a DB, for now just mock success
  console.log('New user registered:', username);
  return res.status(201).json({ message: 'Signup successful!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

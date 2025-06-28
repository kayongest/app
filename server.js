require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path"); // Add this line to fix the error

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000", // or whatever port your frontend is on
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Updated this line

// In-memory database (replace with real database in production)
let users = [
  {
    id: uuidv4(),
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    createdAt: new Date().toISOString(),
  },
];

let keys = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.sendStatus(403);
  }
};

// Routes
// Example backend login endpoint (Node.js/Express)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username); // Debug log

  const user = users.find((u) => u.username === username);

  if (!user) {
    console.log("User not found:", username); // Debug log
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    console.log("Password mismatch for user:", username); // Debug log
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Login successful, token generated for:", username); // Debug log
  res.json({ token, username: user.username, role: user.role });
});

app.get("/api/keys", authenticateJWT, (req, res) => {
  res.json(keys);
});

app.post("/api/keys", authenticateJWT, (req, res) => {
  const newKey = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    createdBy: req.user.username,
  };

  keys.push(newKey);
  res.status(201).json(newKey);
});

// Update the PUT and DELETE key routes in server.js:

// Only allow admins or the original creator to edit keys
app.put("/api/keys/:id", authenticateJWT, (req, res) => {
  const keyId = req.params.id;
  const keyIndex = keys.findIndex((k) => k.id === keyId);

  if (keyIndex === -1) {
    return res.status(404).json({ error: "Key not found" });
  }

  // Regular users can't edit ANY keys (even their own)
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can edit keys" });
  }

  keys[keyIndex] = { ...keys[keyIndex], ...req.body };
  res.json(keys[keyIndex]);
});

// Only allow admins to delete keys
app.delete("/api/keys/:id", authenticateJWT, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can delete keys" });
  }

  const keyId = req.params.id;
  const keyIndex = keys.findIndex((k) => k.id === keyId);

  if (keyIndex === -1) {
    return res.status(404).json({ error: "Key not found" });
  }

  keys.splice(keyIndex, 1);
  res.sendStatus(204);
});

// Admin routes
app.get("/api/users", authenticateJWT, isAdmin, (req, res) => {
  const usersWithoutPasswords = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersWithoutPasswords);
});

app.post("/api/users", authenticateJWT, isAdmin, (req, res) => {
  const { username, password, role } = req.body;

  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const newUser = {
    id: uuidv4(),
    username,
    password: bcrypt.hashSync(password, 10),
    role: role || "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.post("/api/users/reset-password", authenticateJWT, isAdmin, (req, res) => {
  const { username, newPassword } = req.body;
  const userIndex = users.findIndex((u) => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex].password = bcrypt.hashSync(newPassword, 10);
  res.sendStatus(200);
});

// Serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

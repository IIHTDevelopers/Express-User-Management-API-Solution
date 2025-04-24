const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Sample collection data for users
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "Bob Brown", email: "bob@example.com" },
  { id: 5, name: "Charlie White", email: "charlie@example.com" },
  { id: 6, name: "David Black", email: "david@example.com" }
];

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the User API!' });
});

// GET users with filter (by name or email)
app.get('/users/filter', (req, res) => {
  const { name, email } = req.query; // Get query parameters

  let filteredUsers = users;

  if (name) {
    filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (email) {
    filteredUsers = filteredUsers.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
  }

  res.status(200).json(filteredUsers);
});

// GET all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// GET a single user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
});

// POST a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser); // Return the created user with status 201
});

// PUT update an existing user by ID
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.status(200).json(user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(userIndex, 1); // Remove the user from the array
  res.status(200).json({ message: 'User deleted successfully' });
});

// Catch-all route for invalid URLs
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });  // Return 404 for unknown routes
});

module.exports = app;  // Export the app for use in other files (e.g., for testing)

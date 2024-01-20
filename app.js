const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: 'db',
  user: 'fati',
  password: 'fati',
  database: 'fati'
});

// Middleware to make 'database' accessible in route handlers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/user-form', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/// Route to create a new user
app.post('/users', (req, res) => {
    const { username, email } = req.body;
  
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
  
    const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
    req.db.query(sql, [username, email], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('User created successfully:', result);
  
        // Fetch all users after inserting and send them to the user-table page
        const fetchUsersSQL = 'SELECT * FROM users';
        req.db.query(fetchUsersSQL, (fetchErr, users) => {
          if (fetchErr) {
            console.error('Error fetching users:', fetchErr);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            // Send user data to user-table.ejs
            console.log('Users fetched successfully:', users); // Add this line
            res.render('showuser', { users });
          }
        });
      }
    });
  });
  

  app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    req.db.query(sql, (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('Users fetched successfully:', users);
        res.render('showuser', { users });
      }
    });
  });
// 404 error handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
    // Start the Express server only after the database connection is established
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});

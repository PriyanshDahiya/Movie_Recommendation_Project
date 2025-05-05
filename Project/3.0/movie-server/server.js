const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Excel file path
const userDataFile = './data/users.xlsx';

// Utility function to read user data from the Excel file
function readUserData() {
    try {
        const workbook = XLSX.readFile(userDataFile);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Trim the keys and values to remove extra spaces
        return data.map(user => {
            return Object.fromEntries(
                Object.entries(user).map(([key, value]) => [key.trim(), value.toString().trim()])
            );
        });
    } catch (err) {
        console.error('Error reading user data:', err.message);
        return [];
    }
}

// Utility function to write user data to the Excel file
function writeUserData(data) {
    try {
        const cleanedData = data.map(user => {
            return Object.fromEntries(
                Object.entries(user).map(([key, value]) => [key.trim(), value.toString().trim()])
            );
        });

        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, userDataFile);
    } catch (err) {
        console.error('Error writing user data:', err.message);
    }
}


// Route: User Registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUserData();

    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Add new user
    const newUser = { username, email, password };
    users.push(newUser);
    writeUserData(users);

    console.log("User registered:", newUser); // Debug log
    res.json({ message: 'Registration successful' });
});

// Route: User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUserData();

    console.log("Login attempt:", email); // Debug log

    // Trim and lowercase the email for accurate comparison
    const user = users.find(user => user.email.trim().toLowerCase() === email.trim().toLowerCase() && user.password === password);
    if (!user) {
        console.log("Login failed for:", email); // Debug log
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Login successful for:", email); // Debug log
    res.json({ message: 'Login successful', user });
});


// Route: User Profile
app.get('/profile', (req, res) => {
    const { email } = req.query;
    const users = readUserData();

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
});

// Route: Movie Search
app.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://streaming-availability.p.rapidapi.com/shows/search/title`, {
            headers: {
                'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY'
            },
            params: {
                series_granularity: 'show',
                show_type: 'movie',
                output_language: 'en',
                title: query
            }
        });
        console.log("API Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        res.status(500).send('Server Error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

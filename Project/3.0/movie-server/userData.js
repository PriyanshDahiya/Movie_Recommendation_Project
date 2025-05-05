// JS file to handle registration and login

const fs = require('fs');
const XLSX = require('xlsx');

const filePath = './data/users.xlsx';

// Load users from the Excel file
function loadUsers() {
    try {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(worksheet);
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
}

// Save users to the Excel file
function saveUsers(users) {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, filePath);
}

// Register a new user
function registerUser(username, email, password) {
    const users = loadUsers();
    const existingUser = users.find(user => user.Email === email);

    if (existingUser) {
        return { success: false, message: "User already exists." };
    }

    users.push({ Username: username, Email: email, Password: password });
    saveUsers(users);
    return { success: true, message: "User registered successfully." };
}

// Login user
function loginUser(email, password) {
    const users = loadUsers();
    const user = users.find(user => user.Email === email && user.Password === password);

    if (user) {
        return { success: true, message: "Login successful." };
    } else {
        return { success: false, message: "Invalid email or password." };
    }
}

module.exports = { registerUser, loginUser };

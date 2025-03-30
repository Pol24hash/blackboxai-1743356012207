const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// API Routes
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Save to a simple JSON file (in production use a database)
    const submission = { name, email, message, date: new Date() };
    fs.readFile('contacts.json', (err, data) => {
        const contacts = err ? [] : JSON.parse(data);
        contacts.push(submission);
        fs.writeFile('contacts.json', JSON.stringify(contacts, null, 2), () => {});
    });

    res.json({ success: true, message: 'Thank you for your message!' });
});

// Serve the main page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
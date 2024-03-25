const express = require('express');
const cors = require('cors');


const bodyParser = require('body-parser');
const {
    createRegistration,
    getAllRegistration,
    getRegistrationById,
    updateRegistration,
    deleteRegistration
} = require('./db/registration');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle POST request to '/register'
app.post('/register', (req, res) => {
    const { firstName, lastName, phoneNumber, email } = req.body;
    createRegistration(firstName, lastName, phoneNumber, email, (err, newRegistrationId) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Registration created successfully', id: newRegistrationId });
    });
});

// Handle GET request to '/registration'
app.get('/registration', (req, res) => {
    getAllRegistration((err, registration) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(registration);
    });
});

// Handle GET request to '/registration/:id'
app.get('/registration/:id', (req, res) => {
    const id = req.params.id;
    getRegistrationById(id, (err, registration) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }
        res.status(200).json(registration);
    });
});

// Handle PUT request to '/registration/:id'
app.put('/registration/:id', (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber, email } = req.body;
    updateRegistration(id, firstName, lastName, phoneNumber, email, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }
        res.status(200).json({ message: 'Registration updated successfully' });
    });
});

// Handle DELETE request to '/registration/:id'
app.delete('/registration/:id', (req, res) => {
    const id = req.params.id;
    deleteRegistration(id, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }
        res.status(200).json({ message: 'Registration deleted successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

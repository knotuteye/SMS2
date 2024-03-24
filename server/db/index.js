const mysql = require('mysql');

// MySQL database connection configuration
const connection = mysql.createConnection({
    host: 'your-rds-host',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database-name'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Function to insert a new registration into the database
const createRegistration = (firstName, lastName, phoneNumber, email, callback) => {
    const sql = 'INSERT INTO registrations (first_name, last_name, phone_number, email) VALUES (?, ?, ?, ?)';
    connection.query(sql, [firstName, lastName, phoneNumber, email], (err, result) => {
        if (err) {
            console.error('Error creating registration:', err);
            callback(err, null);
            return;
        }
        console.log('Registration created successfully');
        callback(null, result.insertId);
    });
};

// Function to retrieve all registrations from the database
const getAllRegistrations = (callback) => {
    const sql = 'SELECT * FROM registrations';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error getting registrations:', err);
            callback(err, null);
            return;
        }
        console.log('Registrations retrieved successfully');
        callback(null, rows);
    });
};

// Function to retrieve a registration by ID from the database
const getRegistrationById = (id, callback) => {
    const sql = 'SELECT * FROM registrations WHERE id = ?';
    connection.query(sql, [id], (err, rows) => {
        if (err) {
            console.error('Error getting registration by ID:', err);
            callback(err, null);
            return;
        }
        console.log('Registration retrieved successfully');
        callback(null, rows[0]);
    });
};

// Function to update a registration in the database
const updateRegistration = (id, firstName, lastName, phoneNumber, email, callback) => {
    const sql = 'UPDATE registrations SET first_name = ?, last_name = ?, phone_number = ?, email = ? WHERE id = ?';
    connection.query(sql, [firstName, lastName, phoneNumber, email, id], (err, result) => {
        if (err) {
            console.error('Error updating registration:', err);
            callback(err, null);
            return;
        }
        console.log('Registration updated successfully');
        callback(null, result.affectedRows);
    });
};

// Function to delete a registration from the database
const deleteRegistration = (id, callback) => {
    const sql = 'DELETE FROM registrations WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting registration:', err);
            callback(err, null);
            return;
        }
        console.log('Registration deleted successfully');
        callback(null, result.affectedRows);
    });
};

module.exports = { createRegistration, getAllRegistrations, getRegistrationById, updateRegistration, deleteRegistration };

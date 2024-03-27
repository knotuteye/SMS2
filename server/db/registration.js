const connection = require('./dbConnection');

// Function to insert a new registration into the database
const createRegistration = (firstName, lastName, phoneNumber, email, country, title, callback) => {
    const sql = 'INSERT INTO registration (first_name, last_name, phone_number, email, country, title) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [firstName, lastName, phoneNumber, email, country, title], (err, result) => {
        if (err) {
            console.error('Error creating registration:', err);
            callback(err, null);
            return;
        }
        console.log('Registration created successfully');
        callback(null, result.insertId);
    });
};

// Function to retrieve all registration from the database
const getAllRegistration = (callback) => {
    const sql = 'SELECT * FROM registration';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error getting registration:', err);
            callback(err, null);
            return;
        }
        console.log('Registration retrieved successfully');
        callback(null, rows);
    });
};

// Function to retrieve a registration by ID from the database
const getRegistrationById = (id, callback) => {
    const sql = 'SELECT * FROM registration WHERE id = ?';
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
const updateRegistration = (id, firstName, lastName, phoneNumber, email, country, title, callback) => {
    const sql = 'UPDATE registration SET first_name = ?, last_name = ?, phone_number = ?, email = ?, country = ?, title = ? WHERE id = ?';
    connection.query(sql, [firstName, lastName, phoneNumber, email, country, title, id], (err, result) => {
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
    const sql = 'DELETE FROM registration WHERE id = ?';
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

module.exports = { createRegistration, getAllRegistration, getRegistrationById, updateRegistration, deleteRegistration };

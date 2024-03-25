-- Create the database
CREATE DATABASE IF NOT EXISTS SMS2;

-- Use the created database
USE SMS2;

-- Create the registration table
CREATE TABLE IF NOT EXISTS registration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(100) NOT NULL
);

-- Optionally, add an index on email column for faster retrieval
CREATE INDEX idx_email ON registration (email);

-- Add a 'created' column to the 'registrations' table
ALTER TABLE registration
ADD created TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add country col
-- Add a 'created' column to the 'registrations' table
ALTER TABLE registration
ADD country VARCHAR(50) NOT NULL;
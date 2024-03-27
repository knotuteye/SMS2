const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { createRegistration, getAllRegistration, getRegistrationById, updateRegistration, deleteRegistration } = require('./db/registration');
const { downloadFileFromS3, uploadFileToS3 } = require('./aws/s3Utils');
const fs = require('fs');
const https = require('https');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory for uploading to S3

// Set up multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Handle POST request to '/bulk/registration'
app.post('/bulk/registration', upload.single('file'), (req, res) => {
    // Check if file is present in the request
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const fileBuffer = req.file.buffer; // Get file buffer from multer

    const fileName = req.file.originalname; // Use original file name for S3 key
    const bucketName = 'bulk-attendance'; // Replace with your S3 bucket name

    // Upload the file to S3
    uploadFileToS3(bucketName, fileName, fileBuffer, (err) => {
        if (err) {
            console.error('Error uploading file to S3:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'File uploaded successfully' });
    });
});

// Handle POST request to '/registration'
app.post('/registration', (req, res) => {
    const { firstName, lastName, phoneNumber, email, country } = req.body;
    createRegistration(firstName, lastName, phoneNumber, email, country, (err, newRegistrationId) => {
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
    const { firstName, lastName, phoneNumber, email, country } = req.body;
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

// Handle GET request to '/registration/bulk'
app.get('/bulk/registration', (req, res) => {
    const fileName = '<Fellowship> <Cell> SMS2.0 Attendance Template.xlsx';
    const bucketName = 'bulk-attendance'; // Replace with your S3 bucket name
    const key = fileName;
    const destinationFilePath = fileName;

    // Download the file from S3
    downloadFileFromS3(bucketName, key, destinationFilePath, (err) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.download(destinationFilePath, fileName, (err) => {
            if (err) {
                console.error('Error sending file to client:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log('File sent to client successfully');
            }
        });
    });
});

// SSL
const options = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH),                  //Change Private Key Path here
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),            //Change Main Certificate Path here
}

// Start the server
const PORT = process.env.PORT || 3000;


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

https.createServer(options, app).listen(PORT);
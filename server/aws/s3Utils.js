const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Initialize AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION, // Replace 'your-region' with the appropriate AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace 'your-access-key-id' with your AWS access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Replace 'your-secret-access-key' with your AWS secret access key
});

// Function to download a file from S3
const downloadFileFromS3 = (bucketName, key, destinationFilePath, callback) => {
  // Create a write stream to save the downloaded file
  const fileStream = fs.createWriteStream(destinationFilePath);

  // Create parameters for S3 getObject operation
  const params = {
    Bucket: bucketName,
    Key: key
  };

  // Retrieve the file from S3
  const s3Stream = s3.getObject(params).createReadStream();

  // Pipe the file data to the write stream
  s3Stream.pipe(fileStream)
    .on('error', (err) => {
      console.error('Error downloading file from S3:', err);
      callback(err);
    })
    .on('close', () => {
      console.log('File downloaded successfully');
      callback(null);
    });
};

// Function to upload a file to S3
const uploadFileToS3 = (bucketName, key, buffer, callback) => {
  // Create parameters for S3 putObject operation
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer
  };

  // Upload the file to S3
  s3.putObject(params, (err, data) => {
    if (err) {
      console.error('Error uploading file to S3:', err);
      callback(err);
      return;
    }
    console.log('File uploaded successfully');
    callback(null);
  });
};

module.exports = { downloadFileFromS3, uploadFileToS3 };
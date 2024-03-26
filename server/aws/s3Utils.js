const AWS = require('aws-sdk');
const fs = require('fs');

// Initialize AWS SDK
const s3 = new AWS.S3({
  region: 'your-region', // Replace 'your-region' with the appropriate AWS region
  accessKeyId: 'your-access-key-id', // Replace 'your-access-key-id' with your AWS access key ID
  secretAccessKey: 'your-secret-access-key' // Replace 'your-secret-access-key' with your AWS secret access key
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

module.exports = { downloadFileFromS3 };

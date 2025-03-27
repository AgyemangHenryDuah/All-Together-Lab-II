require('dotenv').config();
const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');

// Create the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Verify S3 configuration
async function verifyS3Config() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET_NAME }));
    console.log('Connected to S3 bucket successfully');
  } catch (error) {
    console.error('Error connecting to S3:', error);
  }
}

verifyS3Config();

module.exports = { s3, S3_BUCKET_NAME };

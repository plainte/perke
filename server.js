const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() });

const { ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");

const s3Client = require('./src/server/s3client.js');

const FOLDER_NAME = 'molnadan';
const BUCKET_NAME = 'perke-dev';

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/dist/perke/browser'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

app.get('/api/data', async (req, res, next) => {
  const command = new ListBucketsCommand({});
  try {
    const { Owner, Buckets} = await s3Client.send(command);
    console.log(
      `${Owner.DisplayName} owns ${Buckets.length} bucket${
        Buckets.length === 1 ? "" : "s"
      }:`,
    );
    console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
    res.json({owner: Owner.DisplayName, buckets: Buckets.length});
  } catch (err) {
    next(err);
  }
})

app.post('/api/upload', upload.array('files'), async (req, res) => {
    try {
      const uploadPromises = req.files.map(file => {
        const parallelUploadS3 = new Upload({
          client: s3Client,
          params: {
            Bucket: BUCKET_NAME,
            Key: `${FOLDER_NAME}/${file.originalname}`,
            Body: Readable.from(file.buffer)
          }
        });

        return parallelUploadS3.done();
      });
  
      await Promise.all(uploadPromises);
  
      res.json({ message: 'Files uploaded to S3 successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));
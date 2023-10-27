const express = require('express');
const app = express();
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
  let deviceId = req.cookies.deviceId;
  if (!deviceId) {
    deviceId = uuid.v4();
    console.log('Setting cookie for deviceId:', deviceId);
    res.cookie('deviceId', deviceId, { maxAge: 900000, httpOnly: true });
    console.log('Cookie has been set' + req.cookies.deviceId);
  }
  req.deviceId = deviceId;
  console.log('Device ID:', deviceId);
  next();
});

cloudinary.config({
  cloud_name: 'dgqaoahbb',
  api_key: '866531434847133',
  api_secret: 'gGpVeSbld70ilJkJ-_5sNqG7WqU',
});

app.post('/upload', (req, res) => {
  const uploadImage = async (imagePath, deviceId) => {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      context: `device_id=${deviceId}`,
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  };
  console.log(req.body);
  const deviceId = req.deviceId;
  uploadImage(req.body.imagePath, deviceId);
});

app.delete('/delete/:public_id', (req, res) => {
  const public_id = req.params.public_id;
  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error('Error deleting image from Cloudinary:', error);
      res.status(500).send('Error deleting image from Cloudinary');
    } else {
      console.log('Image deleted from Cloudinary:', result);
      const cacheBuster = new Date().getTime();
      const imageUrl = `https://res.cloudinary.com/dgqaoahbb/image/upload/v${cacheBuster}/${public_id}.jpg`;
      res.send({
        imageUrl: imageUrl,
      });
    }
  });
});

app.get('/get-images', (req, res) => {
  console.log('Cookie has been set:', req.cookies.deviceId);
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

import { ImageKit } from '@imagekit/nodejs/index.js';

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_KEY
});


async function uploadFile(buffer) {
  const response = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: 'profile.jpg',
  });
  return response
}


export default uploadFile;
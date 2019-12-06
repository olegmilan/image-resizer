const fs = require('fs');
const sharp = require('sharp');

const dirname = './imgs/';
const dirnameOfGeneratedFiles = './transformed/';

const sizes = {
  x1: {
    width: 375,
    height: 667,
  },
  x2: {
    width: 750,
    height: 1334,
  },
  x3: {
    width: 1125,
    height: 2001,
  }
};

async function convertImages() {
  const images = await readFiles();
  images.forEach((img) => {
    if (!img.includes('.png')) {
      return;
    }

    let newFileName = img.replace('.png', '.jpg').replace('@1x', '');
    log(newFileName);

    newFileName = dirnameOfGeneratedFiles + newFileName;
    const fileToTransform = dirname + img;



    sharp(fileToTransform)
      .jpeg({
        quality: 75
      })
      .toFile(newFileName)
      .then(() => {
        const thumbName = newFileName.replace('transformed/', 'thumbs/');
        let _sizes = sizes.x1;
        if (thumbName.includes('@2x')) {
          _sizes = sizes.x2;
        } else if (thumbName.includes('@3x')) {
          _sizes = sizes.x3;
        }

        const width = parseInt(_sizes.width / 4);
        const height = parseInt(_sizes.height / 4);
        sharp(newFileName)
          .resize(width, height)
          .toFile(thumbName)
      })

  });
}

convertImages();

async function readFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        return reject('Error on load file');
      }

      resolve(filenames);
    });
  });
}

function log(filename) {
  const name = filename.replace(/_/g, '').replace('.jpg', '');
  const thumbName = `${name}Thumb`;
  if (filename.includes('@')) {
    return;
  }
  const fullName = `import ${name} from 'SpringshotMobile/App/img/background/stock/${filename}';\n`;
  const fullNameThumb = `import ${thumbName} from 'SpringshotMobile/App/img/background/stock/thumbs/${filename}';\n`;
  const line = `
    ${name}: {
      thumb: ${thumbName},
      image: ${name},
    },`;
  const shortName = `${name},\n`;
  console.log('write filepath', fullName);
  fs.appendFileSync('message.txt', fullName);
  fs.appendFileSync('message1.txt', shortName);
  fs.appendFileSync('message2.txt', fullNameThumb);
  fs.appendFileSync('message3.txt', line);
}

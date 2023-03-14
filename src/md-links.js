import fs from 'fs';
import path from 'path';

export const mdLinks = (filePath, options) => {
  console.log(filePath);
  console.log(`Existe la ruta? ${filePath} : ${fs.existsSync(filePath)}`);
  console.log(`Es Absoluta? ${path.isAbsolute(filePath)}`);
  fs.readFile(filePath, 'utf8', function (err, data) {
    console.log(data);
    const regex = /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}([a-z0-9\-\/\.\#\_?=&]*)?/igm;
    const matches = data.match(regex);
    

    console.log(matches);
  });

  // console.log(fs.readdirSync(filePath));

  // const pathExist = (filePath) => {
  //   return fs.existsSync(filePath);
  // }
  // console.log(`Existe la ruta? ${filePath} : ${pathExist(filePath)}`);
  // console.log('\nCurrent directory filenames:');
  // console.log(path.isAbsolute(filePath));
  // filenames.forEach((file) => {
  //   console.log(file);
  //   console.log(__dirname);
  // });
};

import fs, { link, promises } from 'fs';


export const mdLinks = (filePath, options) => {
  console.log(`Existe la ruta? ${filePath} : ${fs.existsSync(filePath)}`);
  // console.log(`Es Absoluta? ${path.isAbsolute(filePath)}`);
  const linksPromise = getLinks(filePath);
  // console.log(linksPromise);
  if (!options.validate) {
    return linksPromise;
  } else {
    return linksPromise.then(links => {
      console.log(links);
      links.forEach(link => {
        // console.log(link.href);
      });
    });
  };
}

function getLinks(filePath) {
  return promises
    .readFile(filePath, { encoding: 'utf8' })
    .then(function (data) {
      const regexLink =
        /\[(?<text>.+)\]\((?<href>(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}([a-z0-9\-\/\.\#\_?=&]*)?)\)/gim;

      const matches = Array.from(data.matchAll(regexLink));
      const linksArray = matches.map((match) => ({
        ...match.groups,
        file: filePath,
      }));
      return linksArray;
    });
}

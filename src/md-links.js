import fs, { promises } from 'fs';

export const mdLinks = (filePath, options) => {
  console.log(`Existe la ruta? ${filePath} : ${fs.existsSync(filePath)}`);
  // console.log(`Es Absoluta? ${path.isAbsolute(filePath)}`);
  const linksPromise = getLinks(filePath).then(function (links) {
    return links;
  });

  const linksResult = !options.validate ? linksPromise : validate(linksPromise);

  if (!options.stats) {
    return linksResult;
  }

  return linksResult.then((links) => {
    return {
      totalLength: links.length,
      unique: new Set(links.map(({ href }) => href)).size,
      broken: options.validate
        ? links.filter(({ ok }) => ok === 'fail').length
        : 0,
    };
  });
};

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

function fetchLink(endpoint) {
  return fetch(endpoint)
    .then(function (response) {
      return { status: response.status, ok: response.statusText.toLowerCase() };
    })
    .catch(function (error) {
      for (const key in error.cause) {
        const status = error.cause[key];
        return { status, ok: 'fail' };
      }
    });
}

function validate(promise) {
  return promise.then((links) => {
    const requests = links.map((objectLink) =>
      fetchLink(objectLink.href).then((validationObject) => ({
        ...validationObject,
        ...objectLink,
      }))
    );
    return Promise.all(requests);
  });
}

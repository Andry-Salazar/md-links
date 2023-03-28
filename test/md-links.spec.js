const {
  routeExist,
  getLinks,
  validate,
  fetchLink,
  mdLinks,
} = require("../src/md-links");
import { expect, describe, it } from "@jest/globals";

describe("routeExist", () => {
  it("should return a true", () => {
    const path = "README.md";
    expect(routeExist(path)).toBe(true);
  });
});

describe("getLinks", () => {
  it("should return a array of links", () => {
    const path = "testDocuments";
    return getLinks(path)
      .then((data) => {
        expect(data).toEqual(linksArray);
      })
      .catch((error) => {
        error;
      });
  });
});

global.fetch = jest.fn(() => {
  return Promise.resolve({ status: 200, ok: "ok" });
});

const objectLinks = [
  {
    text: 'Leer un directorio',
    href: 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
    file: 'ejemplo.md'
  },
  {
    text: 'Path',
    href: 'https://nodejs.org/api/path.html',
    file: 'ejemplo.md'
  },
  {
    text: 'Linea de comando CLI',
    href: 'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e',
    file: 'ejemplo.md'
  },
  {
    text: 'recurso',
    href: 'https://www.youtube.com/watch?v=Lub5qOmY4JQ',
    file: 'ejemplo.md'
  }
]

describe("validate", () => {
  it("should return validate", async () => { 
    const linkObject = getLinks("ejemplo.md")
    .then(function (links) {
      return links;
    });
    const result = await validate(linkObject)
    expect(result).toEqual(objectLinks);
  });
});

// describe("mdLinks", () => {
//   it("should return getLinks", async () => { 
//     const linkObject = getLinks("ejemplo.md")
//     .then(function (links) {
//       return links;
//     });
//     const result = await validate(linkObject)
//     expect(result).toEqual(objectLinks);
//   });
// });

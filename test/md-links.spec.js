const {
  routeExist,
  getLinks,
  validate,
  mdLinks,
  fetchLink,
} = require("../src/md-links");
import { expect, describe, it } from "@jest/globals";
import fs from "fs";

describe("routeExist", () => {
  it("should return a true", () => {
    const path = "README.md";
    expect(routeExist(path)).toBe(true);
  });
});

describe("getLinks", () => {
  it("should return an array of link objects", () => {
    jest.spyOn(fs.promises, "readFile").mockResolvedValue(`
      This is a [link](https://example.com) to example.com.
      This is another [link](https://google.com) to google.com.
    `);

    return getLinks("example.md").then((result) => {
      expect(result).toEqual([
        {
          text: "link",
          href: "https://example.com",
          file: "example.md",
        },
        {
          text: "link",
          href: "https://google.com",
          file: "example.md",
        },
      ]);
    });
  });
});

// const objectLinks = [
//   {
//     text: 'Leer un directorio',
//     href: 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
//     file: 'ejemplo.md'
//   },
//   {
//     text: 'Path',
//     href: 'https://nodejs.org/api/path.html',
//     file: 'ejemplo.md'
//   },
//   {
//     text: 'Linea de comando CLI',
//     href: 'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e',
//     file: 'ejemplo.md'
//   },
//   {
//     text: 'recurso',
//     href: 'https://www.youtube.com/watch?v=Lub5qOmY4JQ',
//     file: 'ejemplo.md'
//   }
// ]

// const objectAverage = [
//   {
//     totalLength: objectLinks.length,
//       unique: new Set(objectLinks.map(({ href }) => href)).size,
//       broken: validate
//         ? objectLinks.filter(({ ok }) => ok === 'fail').length
//         : 0,
//     }
// ]

describe("mdLinks", () => {
  beforeEach(() => {
    jest.spyOn(fs, "existsSync").mockImplementation(() => true);
    jest.spyOn(fs.promises, "readFile").mockResolvedValue(`
      This is a [link](https://example.com) to example.com.
      This is another [link](https://google.com) to google.com.
    `);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("routeExist to be true", () => {
    const path = "example.md";
    expect(routeExist(path)).toBe(true);
  });

  it("should return an array of link objects", () => {
    return mdLinks("example.md", {}).then((result) => {
      expect(result).toEqual([
        {
          text: "link",
          href: "https://example.com",
          file: "example.md",
        },
        {
          text: "link",
          href: "https://google.com",
          file: "example.md",
        },
      ]);
    });
  });

  describe("validate", () => {
    it('debería retornar un arreglo de objetos con las propiedades "status", "ok" y las propiedades originales de los links', async () => {
      // preparar el estado inicial
      const links = [
        { href: "https://www.google.com" },
        { href: "https://www.github.com" },
      ];
      const expected = [
        {
          href: "https://www.google.com",
          status: 200,
          ok: "ok",
        },
        {
          href: "https://www.github.com",
          status: 404,
          ok: "fail",
        },
      ];
      // mockear la función fetchLink
      jest.fn("", () => ({
        fetchLink: jest.fn(),
      }));

      global.fetch = jest.fn(() => {
        return Promise.resolve({ status: 200, ok: "ok" });
      });
      // configurar el comportamiento del mock de fetchLink

      fetchLink((endpoint) => {
        return fetch(endpoint)
          .then(function () {
            Promise.resolve({
              status: 200,
              statusText: "OK",
            });
          })
          .catch(function () {
            Promise.reject({
              status: 404,
              statusText: "fail",
            });
            // llamar a la función y evaluar el resultado
            const result = validate(Promise.resolve(links));
            expect(result).toEqual(expected);
          });
      });
    });

    it("should return an array of validated link objects", () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        statusText: "OK",
      });

      return mdLinks("example.md", { validate: true }).then((result) => {
        expect(result).toEqual([
          {
            text: "link",
            href: "https://example.com",
            file: "example.md",
            status: 200,
            ok: "ok",
          },
          {
            text: "link",
            href: "https://google.com",
            file: "example.md",
            status: 200,
            ok: "ok",
          },
        ]);
      });
    });

    it("should return stats object with totalLength, unique and broken properties", () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        status: 404,
        statusText: "Not Found",
      });
      return mdLinks("example.md", { stats: true, validate: true }).then(
        (result) => {
          expect(result).toEqual({
            totalLength: 2,
            unique: 2,
            broken: 0,
          });
        }
      );
    });

    it("should reject with an error if file does not exist", () => {
      jest.spyOn(fs, "existsSync").mockImplementation(() => false);

      return mdLinks("example.md", {}).catch((error) => {
        expect(error).toEqual(new Error("Error"));
      });
    });
  });
});

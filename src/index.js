import { Command } from 'commander';
import { mdLinks } from './md-links';

const program = new Command();

program
  .name('md-links')
  .description('CLI para evaluar links dentro de archivos Markdown')
  .version('0.0.1');

program
  .command('md-links')
  .description(
    'Verifica los links en un archivo Markdown que contengan y reportar algunas estadísticas.'
  )
  .argument(
    '<path-to-file>',
    'Ruta absoluta o relativa al archivo o directorio.'
  )
  .option(
    '--validate',
    'Booleano que determina si se desea validar los links encontrados.',
    false
  )
  .option(
    '--stats',
    'Genera una salida con estadísticas básicas sobre los links.'
  )
  .action((filePath, options) => {
    mdLinks(filePath, options).then((data) => {
      if (!options.stats) {
        data.forEach((link) => {
          const validateOutput = options.validate
            ? ` ${link.ok} ${link.status}`
            : '';
          const output = `${link.file} ${link.href}${validateOutput} "${link.text}"`;
          console.log(output);
        });
      } else {
        console.log(`Total: ${data.totalLength}`);
        console.log(`Unique: ${data.unique}`);
        if (options.validate) {
          console.log(`Broken: ${data.broken}`);
        }
      }
    });
  });
program.parse();

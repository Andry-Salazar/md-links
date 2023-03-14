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
    false,
  )
  .option(
    '--stats',
    'Genera una salida con estadísticas básicas sobre los links.'
  )
  .action((filePath, options) => {
    mdLinks(filePath, options).then(links => {
      links.forEach(link => {
        console.log(`${link.file} ${link.href} ${link.text}`);
      });
    });
  });

program.parse();

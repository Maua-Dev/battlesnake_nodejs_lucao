import * as fs from 'fs';
import * as path from 'path';

const IAC_DIRECTORY_NAME = 'iac';
const SOURCE_DIRECTORY_NAME = 'src';
const NEW_NODE_MODULES_DIR_NAME = '_node_modules';
const NODE_MODULES_DIR_NAME = 'node_modules';

export function adjustLayerDirectory(): void {
  // Obtém o diretório raiz do diretório fonte
  const rootDirectory = path.join(__dirname, '..');
  const iacDirectory = path.join(rootDirectory, IAC_DIRECTORY_NAME);

  console.log(`Root directory: ${rootDirectory}`);
  console.log(`Root directory files: ${fs.readdirSync(rootDirectory)}`);
  console.log(`IaC directory: ${iacDirectory}`);
  console.log(`IaC directory files: ${fs.readdirSync(iacDirectory)}`);

  // Define os diretórios de origem e destino para shared
  const sourceDirectory = path.join(rootDirectory, NODE_MODULES_DIR_NAME);
  const destinationDirectory = path.join(rootDirectory, 'dist', NODE_MODULES_DIR_NAME);

  // Apaga o diretório de destino se ele existir
  if (fs.existsSync(destinationDirectory)) {
    fs.rmSync(destinationDirectory, { recursive: true, force: true });
  }

  // Cria o diretório de destino
  fs.mkdirSync(destinationDirectory, { recursive: true });

  // Copia o diretório fonte para o diretório de destino
  console.log(`Copying files from ${sourceDirectory} to ${destinationDirectory}`);
  copyFolderSync(sourceDirectory, destinationDirectory);

  
}

function copyFolderSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);

  for (const file of files) {
    const current = fs.lstatSync(path.join(src, file));

    if (current.isDirectory()) {
      copyFolderSync(path.join(src, file), path.join(dest, file));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, file));
      fs.symlinkSync(symlink, path.join(dest, file));
    } else {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
  }
}

if (require.main === module) {
  adjustLayerDirectory();
}
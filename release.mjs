import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

const __dirname = import.meta.dirname;

const dist = path.join(__dirname, 'dist');

// Supprimer l'ancien dossier dist
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}

// Créer le dossier dist
fs.mkdirSync(dist, { recursive: true });

// Déplacer et copier les fichiers nécessaires
fs.renameSync('main.js', path.join(dist, 'main.js'));
fs.copyFileSync('src/styles.css', path.join(dist, 'styles.css'));
fs.copyFileSync('manifest-beta.json', path.join(dist, 'manifest.json'));
//zip dist

const distZip = path.join(__dirname, 'obsidian-icon-folder.zip');

// Supprimer l'ancien fichier ZIP s'il existe
if (fs.existsSync(distZip)) {
  fs.unlinkSync(distZip);
}

// Créer une archive ZIP
const output = fs.createWriteStream(distZip);
const archive = archiver('zip', { zlib: { level: 9 } });

// Gestion des événements
output.on('close', () => {
  console.log(`Archive créée : ${distZip} (${archive.pointer()} octets)`);
});

archive.on('error', (err) => {
  throw err;
});

// Début de l'archivage
archive.pipe(output);
archive.directory(dist, false); // Ajoute tout le contenu du dossier dist
archive.finalize();

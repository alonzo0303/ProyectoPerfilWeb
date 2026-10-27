// Copia únicamente los recursos públicos necesarios, conservando la licencia.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules/@fortawesome/fontawesome-free');
const target = path.join(root, 'src/main/resources/static/vendor/fontawesome');
fs.mkdirSync(path.join(target, 'css'), {recursive: true});
fs.copyFileSync(path.join(source, 'css/all.min.css'), path.join(target, 'css/all.min.css'));
fs.cpSync(path.join(source, 'webfonts'), path.join(target, 'webfonts'), {recursive:true});
fs.copyFileSync(path.join(source, 'LICENSE.txt'), path.join(target, 'LICENSE.txt'));

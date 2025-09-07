// This script copies all EJS templates from src/mail/templates to dist/mail/templates after build.
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'mail', 'templates');
const destDir = path.join(__dirname, 'dist', 'mail', 'templates');

function copyTemplates(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        if (fs.lstatSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

copyTemplates(srcDir, destDir);
console.log('EJS templates copied to dist/mail/templates.');

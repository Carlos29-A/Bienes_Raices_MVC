import postcss from 'postcss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'public/css/tailwind.css');
const outputFile = path.join(__dirname, 'public/css/app.css');

async function buildCSS() {
    try {
        const css = fs.readFileSync(inputFile, 'utf8');
        const result = await postcss([
            tailwindcss,
            autoprefixer
        ]).process(css, {
            from: inputFile,
            to: outputFile
        });

        fs.writeFileSync(outputFile, result.css);
        console.log('CSS generado exitosamente en:', outputFile);
    } catch (error) {
        console.error('Error al generar el CSS:', error);
    }
}

buildCSS(); 
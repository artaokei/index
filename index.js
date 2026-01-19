import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

async function serveTextFile(relativePath, res) {
    const filePath = path.resolve(__dirname, relativePath);
    try {
        await access(filePath, constants.R_OK);
        const fileContent = await readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.send(fileContent);
    } catch (error) {
        res.status(404).send(`File tidak ditemukan: ${relativePath}`);
    }
}

const redirects = {
    '/dc/uncle': 'https://discord.gg/funqNPfemD',
    '/dc/arthub': 'https://discord.gg/js4nA59uBS'
};

Object.entries(redirects).forEach(([route, url]) => {
    app.get(route, (req, res) => res.redirect(302, url));
});

const scripts = {
    '/fishit': 'script/fishit',
    '/fish': 'script/dbfish',
    '/ui': 'UI/Lib',
    '/UI': 'UI/Lib',
    '/v3': 'script/v3graeg', // Disesuaikan dengan gambar
    '/av4abyn4e': 'script/av4abyn4e',
    '/blatant': 'script/blatant',
    '/dbfish': 'db/fish' // Sesuai folder db di gambar
};

Object.entries(scripts).forEach(([route, file]) => {
    app.get(route, (req, res) => serveTextFile(file, res));
});

app.get('/bg.png', (req, res) => serveFile('db/bg.png', res, 'image/png'));
app.get('/icon.png', (req, res) => serveFile('db/icon.png', res, 'image/png'));

app.get('/mt-manager', (req, res) => {
    const filePath = path.resolve(__dirname, 'apk/MT-Manager.apk');
    res.download(filePath, 'ArtHub-Manager.apk', (err) => {
        if (err && !res.headersSent) {
            res.status(404).send('APK tidak ditemukan.');
        }
    });
});

export default app;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

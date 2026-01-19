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
app.use(express.static(path.join(__dirname, 'views')));
app.use('/script', express.static(path.join(__dirname, 'script')));

async function serveTextFile(relativePath, res) {
    const filePath = path.join(__dirname, relativePath);
    try {
        await access(filePath, constants.R_OK);
        const fileContent = await readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.send(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).send('File not found');
        } else {
            res.status(500).send('Internal Server Error');
        }
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
    '/v3': 'script/v3',
    '/av4abyn4e': 'script/av4abyn4e',
    '/blatant': 'script/blatant'
};

Object.entries(scripts).forEach(([route, file]) => {
    app.get(route, (req, res) => serveTextFile(file, res));
});

app.get('/mt-manager', (req, res) => {
    const filePath = path.join(__dirname, 'apk', 'MT-Manager.apk');
    res.download(filePath, 'ArtHub-Manager.apk', (err) => {
        if (err && !res.headersSent) {
            res.status(404).send('File tidak ditemukan.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

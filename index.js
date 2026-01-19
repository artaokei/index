import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

async function serveScript(relativePath, res) {
    try {
        const filePath = path.join(__dirname, relativePath);
        const content = await readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.send(content);
    } catch (error) {
        res.status(404).send(`File tidak ditemukan: ${relativePath}`);
    }
}

app.get('/dc/uncle', (req, res) => res.redirect('https://discord.gg/funqNPfemD'));
app.get('/dc/arthub', (req, res) => res.redirect('https://discord.gg/js4nA59uBS'));

app.get('/fishit', (req, res) => serveScript('script/fishit', res));
app.get('/fish', (req, res) => serveScript('script/dbfish', res));
app.get('/ui', (req, res) => serveScript('UI/Lib', res));
app.get('/UI', (req, res) => serveScript('UI/Lib', res));
app.get('/v3', (req, res) => serveScript('script/v3graeg', res));
app.get('/av4abyn4e', (req, res) => serveScript('script/av4abyn4e', res));
app.get('/blatant', (req, res) => serveScript('script/blatant', res));
app.get('/dbfish', (req, res) => serveScript('db/fish', res));

app.get('/bg.png', (req, res) => res.sendFile(path.join(__dirname, 'db/bg.png')));
app.get('/icon.png', (req, res) => res.sendFile(path.join(__dirname, 'db/icon.png')));

app.get('/mt-manager', (req, res) => {
    res.download(path.join(__dirname, 'apk/MT-Manager.apk'), 'ArtHub-Manager.apk');
});

app.get('/check-files', (req, res) => {
    const folders = ['UI', 'script', 'db', 'apk'];
    let report = {};
    folders.forEach(f => {
        const p = path.join(__dirname, f);
        report[f] = fs.existsSync(p) ? fs.readdirSync(p) : 'FOLDER TIDAK ADA';
    });
    res.json({ __dirname, report });
});

export default app;

app.listen(PORT, () => console.log(`Server on ${PORT}`));

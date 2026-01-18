import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));
app.use('/script', express.static(path.join(__dirname, 'script')));

async function serveTextFile(relativePath, req, res) {
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
            console.error(`Error reading file at ${relativePath}:`, error);
            res.status(500).send('Error reading file content');
        }
    }
}

app.get('/dc/uncle', (req, res) => {
    res.redirect(302, 'https://discord.gg/funqNPfemD');
});
app.get('/dc/arthub', (req, res) => {
    res.redirect(302, 'https://discord.gg/js4nA59uBS');
});

app.get('/fishit', (req, res) => {
    serveTextFile('script/fishit', req, res);
});

app.get('/dbfish', (req, res) => {
    serveTextFile('db/fish', req, res);
});

app.get('/v2', (req, res) => {
    serveTextFile('script/v2', req, res);
});

app.get('/v3', (req, res) => {
    serveTextFile('script/v3', req, res);
})

app.get('/av4abyn4e', (req, res) => {
    serveTextFile('script/av4abyn4e', req, res);
})

app.get('/blatant', (req, res) => {
    serveTextFile('script/blatant', req, res);
});


app.get('/mt-manager', (req, res) => {
    // 1. Tentukan lokasi file APK kamu
    const filePath = path.join(__dirname, 'apk', 'MT-Manager.apk');
    
    // 2. Tentukan nama file saat nanti muncul di HP/PC user (opsional)
    const fileName = 'ArtHub-Manager.apk';

    // 3. Gunakan fungsi res.download
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error("Gagal mendownload file:", err);
            // Beri tahu user jika file tidak ada atau error
            if (!res.headersSent) {
                res.status(404).send('Maaf, file aplikasi tidak ditemukan.');
            }
        }
    });
});

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(cors());
app.use(express.json());

// Yorumları oku/yaz
function readComments() {
    if (!fs.existsSync(COMMENTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
}
function writeComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// Yardımcı: Kullanıcıları oku/yaz
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Kayıt
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Eksik bilgi!' });
    let users = readUsers();
    if (users[username]) return res.status(409).json({ success: false, message: 'Kullanıcı adı zaten var!' });
    const hash = await bcrypt.hash(password, 10);
    users[username] = { password: hash };
    writeUsers(users);
    res.json({ success: true, message: 'Kayıt başarılı!' });
});

// Giriş
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Eksik bilgi!' });
    let users = readUsers();
    if (!users[username]) return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı!' });
    const valid = await bcrypt.compare(password, users[username].password);
    if (!valid) return res.status(401).json({ success: false, message: 'Şifre yanlış!' });
    res.json({ success: true, message: 'Giriş başarılı!', username });
});

// Yorumları getir
app.get('/api/comments', (req, res) => {
    const { manga } = req.query;
    let comments = readComments();
    if (manga) comments = comments.filter(c => c.manga === manga);
    res.json(comments);
});

// Yorum ekle
app.post('/api/comments', (req, res) => {
    const { manga, kullanici, yildiz, icerik, gif } = req.body;
    if (!manga || !kullanici || !yildiz || !icerik) {
        return res.json({ success: false, message: 'Eksik bilgi.' });
    }
    const comments = readComments();
    comments.push({ manga, kullanici, yildiz, icerik, gif });
    writeComments(comments);
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.send('Anime Vortex Backend API çalışıyor!');
});

app.listen(PORT, () => {
    console.log(`Backend API çalışıyor: http://localhost:${PORT}`);
});

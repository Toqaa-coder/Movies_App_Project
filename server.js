const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Users
const users = [
    { username: "aya", password: "1234", fullname: "Aya Cohen" },
    { username: "bushra", password: "1234", fullname: "Bushra" },
    { username: "admin", password: "admin", fullname: "Administrator" }
];

// Profiles (בזיכרון)
let profiles = [
    { id: 1, username: "aya", profileName: "Aya", avatar: "A", color: "#e50914" },
    { id: 2, username: "bushra", profileName: "Bushra", avatar: "B", color: "#1f8ef1" }
];

// Catalog
const catalog = [ /* ... כל הקטלוג שיש לך ... */ ];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.json({ success: false, message: "שם משתמש או סיסמה שגויים" });
    }

    const token = `token_${username}_${Date.now()}`;
    
    res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true });
    res.cookie('username', username, { maxAge: 3600000 });

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

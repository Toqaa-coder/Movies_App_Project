
const express      = require('express');
const crypto       = require('crypto');
const cookieParser = require('cookie-parser');
const path         = require('path');
 
const app  = express();
const PORT = 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
/* ══════════════════════════════════════════
   USERS
══════════════════════════════════════════ */
const USERS = [
    { username: "paul",   password: "1234",  fullname: "Paul"          },
    { username: "aya",    password: "1234",  fullname: "Aya Cohen"     },
    { username: "bushra", password: "1234",  fullname: "Bushra"        },
    { username: "admin",  password: "abcd",  fullname: "Administrator" }
];
 
/* ══════════════════════════════════════════
   SESSION STORE  (in-memory, secure token)
══════════════════════════════════════════ */
const sessions = {};
 
function createSession(username) {
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = { username, createdAt: Date.now() };
    return token;
}
 
function validateSession(token) {
    if (!token) return null;
    const s = sessions[token];
    if (!s) return null;
    // 2-hour expiry
    if (Date.now() - s.createdAt > 2 * 60 * 60 * 1000) {
        delete sessions[token];
        return null;
    }
    return s;
}
 
/* ══════════════════════════════════════════
   AUTH MIDDLEWARE
   Supports both: cookie  AND  x-auth-token header
══════════════════════════════════════════ */
function requireAuth(req, res, next) {
    const token = req.cookies?.authToken || req.headers['x-auth-token'];
    const session = validateSession(token);
    if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.username = session.username;
    next();
}
 
/* ══════════════════════════════════════════
   PROFILES / PERSONAS  (in-memory)
══════════════════════════════════════════ */
let profiles = [
    { id: 1, username: "paul",   profileName: "Paul",   avatar: "P", color: "#e50914" },
    { id: 2, username: "aya",    profileName: "Aya",    avatar: "A", color: "#e50914" },
    { id: 3, username: "bushra", profileName: "Bushra", avatar: "B", color: "#1f8ef1" },
    { id: 4, username: "admin",  profileName: "Admin",  avatar: "A", color: "#f5a623" }
];
 

let personas = [
    { id: 1, name: "Anna",  img: "https://i.pravatar.cc/150?img=47" },
    { id: 2, name: "Ronni", img: "https://i.pravatar.cc/150?img=52" },
    { id: 3, name: "Lior",  img: "https://i.pravatar.cc/150?img=33" },
    { id: 4, name: "Alon",  img: "https://i.pravatar.cc/150?img=68" }
];
let nextPersonaId = 5;
 
/* ══════════════════════════════════════════
   CATALOG  (in-memory)
══════════════════════════════════════════ */
const catalog = [
    { id:1,  title:"The WONDERfools",    year:2026, genre:"Fantasy", type:"Series", row:"trending",  img:"https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/The_Wonderfools_poster.png/250px-The_Wonderfools_poster.png", likes:920,  badge:"New Series" },
    { id:2,  title:"The Last of Us",     year:2023, genre:"Drama",   type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", likes:1500 },
    { id:3,  title:"Breaking Bad",       year:2008, genre:"Crime",   type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", likes:1500, badge:"NEW SEASON COMING SOON" },
    { id:4,  title:"Inception",          year:2010, genre:"Action",  type:"Movie",  row:"trending",  img:"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", likes:2000 },
    { id:5,  title:"The Crown",          year:2016, genre:"Drama",   type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg", likes:980  },
    { id:6,  title:"Squid Game",         year:2021, genre:"Thriller",type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg", likes:3200 },
    { id:7,  title:"The Witcher",        year:2019, genre:"Fantasy", type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg", likes:1100 },
    { id:8,  title:"Interstellar",       year:2014, genre:"Sci-Fi",  type:"Movie",  row:"trending",  img:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", likes:870  },
    { id:18, title:"Stranger Things",    year:2016, genre:"Sci-Fi",  type:"Series", row:"trending",  img:"https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg", likes:2200 },
    { id:9,  title:"Love is Blind",      year:2020, genre:"Reality", type:"Series", row:"reality",   img:"https://m.media-amazon.com/images/M/MV5BNDk5OGRjZDEtMjc3Yi00Y2QxLWI3ZmYtNDY2NmYyMzlhZWU3XkEyXkFqcGc@._V1_.jpg", likes:546 },
    { id:10, title:"Building the Band",  year:2024, genre:"Reality", type:"Series", row:"reality",   img:"https://m.media-amazon.com/images/M/MV5BY2Q3MWNmMzQtZGIwMC00ZDJkLWE5MmEtMTdmYTBkOGJmZWE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", likes:0, badge:"NEW SEASON COMING SOON" },
    { id:11, title:"Perfect Match",      year:2023, genre:"Reality", type:"Series", row:"reality",   img:"https://upload.wikimedia.org/wikipedia/en/7/7b/Perfect_Match_2023.png", likes:420 },
    { id:12, title:"The Circle",         year:2020, genre:"Reality", type:"Series", row:"reality",   img:"https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/The_Circle_Season_3.jpeg/250px-The_Circle_Season_3.jpeg", likes:420 },
    { id:13, title:"Indian Matchmaking", year:2020, genre:"Reality", type:"Series", row:"reality",   img:"https://m.media-amazon.com/images/M/MV5BYTgwYTVhMTUtMjAyMi00Y2MxLTg4NWQtNjU1Nzg1NTkyNmEzXkEyXkFqcGc@._V1_.jpg", likes:310 },
    { id:14, title:"The Sandman",        year:2022, genre:"Fantasy", type:"Series", row:"continue",  img:"https://image.tmdb.org/t/p/w500/q54qEgagGOYCq5D1903eBVMNkbo.jpg", likes:760,  progress:80  },
    { id:15, title:"Wednesday",          year:2022, genre:"Comedy",  type:"Series", row:"continue",  img:"https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", likes:2800, progress:45  },
    { id:16, title:"Bridgerton",         year:2020, genre:"Romance", type:"Series", row:"continue",  img:"https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg", likes:1900, progress:100 },
    { id:17, title:"Money Heist",        year:2017, genre:"Crime",   type:"Series", row:"continue",  img:"https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg", likes:2100, progress:20  },
];
 
/* ══════════════════════════════════════════
   ROUTES — PUBLIC
══════════════════════════════════════════ */
 
// Home → login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
 
// POST /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
 
    if (!username || !password) {
        return res.json({ success: false, message: "Please fill in all fields" });
    }
    if (username.length < 2) {
        return res.json({ success: false, message: "Username must be at least 2 characters" });
    }
    if (password.length < 4) {
        return res.json({ success: false, message: "Password must be at least 4 characters" });
    }
 
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.json({ success: false, message: "Incorrect username or password" });
    }
 
    const token = createSession(username);
 
    res.cookie('authToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
    res.cookie('username',  username, { maxAge: 2 * 60 * 60 * 1000 });
 
    res.json({ success: true, token, username });
});
 
app.post('/logout', (req, res) => {
    const token = req.cookies?.authToken || req.headers['x-auth-token'];
    if (token) delete sessions[token];
    res.clearCookie('authToken');
    res.clearCookie('username');
    res.json({ success: true });
});
 

app.get('/api/session-check', (req, res) => {
    const token = req.cookies?.authToken || req.headers['x-auth-token'];
    const s = validateSession(token);
    res.json({ valid: !!s, username: s?.username || null });
});
 
/* ══════════════════════════════════════════
   ROUTES — PROTECTED
══════════════════════════════════════════ */
 

app.get('/api/profiles', requireAuth, (req, res) => {
    const userProfiles = profiles.filter(p => p.username === req.username);
    res.json({ success: true, profiles: userProfiles });
});

app.post('/api/profiles', requireAuth, (req, res) => {
    const { profileName, color } = req.body;
    if (!profileName || profileName.trim() === '') {
        return res.json({ success: false, message: "Profile name is required" });
    }
    const newProfile = {
        id:          Date.now(),
        username:    req.username,
        profileName: profileName.trim(),
        avatar:      profileName.trim()[0].toUpperCase(),
        color:       color || '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    };
    profiles.push(newProfile);
    res.json({ success: true, profile: newProfile });
});
 

app.get('/api/personas', requireAuth, (req, res) => {
    res.json(personas);
});
 

app.post('/api/personas', requireAuth, (req, res) => {
    const { name, img } = req.body;
    if (!name || name.trim().length < 1) {
        return res.status(400).json({ success: false, message: "Name is required" });
    }
    const newPersona = {
        id:   nextPersonaId++,
        name: name.trim(),
        img:  (img && img.trim() !== '')
                ? img.trim()
                : `https://i.pravatar.cc/150?img=${nextPersonaId + 10}`
    };
    personas.push(newPersona);
    res.json({ success: true, persona: newPersona });
});
 
// GET /api/catalog
app.get('/api/catalog', requireAuth, (req, res) => {
    res.json(catalog);
});
 
// POST /api/catalog/:id/like
app.post('/api/catalog/:id/like', requireAuth, (req, res) => {
    const id   = parseInt(req.params.id);
    const item = catalog.find(m => m.id === id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    item.likes++;
    res.json({ success: true, likes: item.likes });
});
 
/* ══════════════════════════════════════════
   START
══════════════════════════════════════════ */
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
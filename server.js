const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const users = [
    { username: "paul",  password: "1234" },
    { username: "admin", password: "abcd" }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const found = users.find(
        u => u.username === username && u.password === password
    );
    
    if (found) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "shem mishtamesh o sisma shguyim" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

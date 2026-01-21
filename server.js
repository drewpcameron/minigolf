const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// This allows the server to read JSON data sent from your game
app.use(express.json());

// This serves your images, html, and js from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// This is your simple JSON "database" file path
const DB_PATH = path.join(__dirname, 'leaderboard.json');

app.post('/save-score', (req, res) => {
    let { name, score } = req.body;
    
    // Force name to be uppercase and max 3 characters
    const cleanName = (name || "???").substring(0, 3).toUpperCase();
    const cleanScore = parseInt(score);

    let data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH)) : [];
    
    data.push({ name: cleanName, score: cleanScore, date: new Date() });
    data.sort((a, b) => a.score - b.score); 
    
    fs.writeFileSync(DB_PATH, JSON.stringify(data.slice(0, 10), null, 2));
    res.json({ success: true });
});

// Route to get the leaderboard data
app.get('/get-leaderboard', (req, res) => {
    if (fs.existsSync(DB_PATH)) {
        const data = JSON.parse(fs.readFileSync(DB_PATH));
        res.json(data);
    } else {
        res.json([]); // Return empty list if no scores exist yet
    }
});

app.listen(PORT, () => {
    console.log(`Server is running! View your game at http://your-ip:${PORT}`);
});
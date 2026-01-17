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

// Route to save a new score after the 9th hole
app.post('/save-score', (req, res) => {
    const { name, score } = req.body;
    
    // Read existing scores or start with an empty list
    let data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH)) : [];
    
    // Add the new score and sort by lowest strokes
    data.push({ name, score, date: new Date() });
    data.sort((a, b) => a.score - b.score); 
    
    // Only keep the top 10 scores
    fs.writeFileSync(DB_PATH, JSON.stringify(data.slice(0, 10), null, 2));
    
    res.json({ success: true, message: "Score saved to the leaderboard!" });
});

app.listen(PORT, () => {
    console.log(`Server is running! View your game at http://your-ip:${PORT}`);
});
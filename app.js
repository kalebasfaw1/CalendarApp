const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/news', async (req, res) => {
    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=8ddcaf3a24ba4a57ad3e6d3b71391d90');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

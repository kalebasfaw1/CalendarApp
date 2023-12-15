import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/news', async (req, res) => {
    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=8ddcaf3a24ba4a57ad3e6d3b71391d90');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/weather', async (req, res) => {
    try {
        const weatherUrl = 'https://api.weatherapi.com/v1/forecast.json?key=ca62f04760f54230a25193515231412&q=Harrisonburg&days=5&aqi=no&alerts=no';
        const response = await fetch(weatherUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Weather Information Service!');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    
    if (!city) {
        return res.status(400).send('Please provide a city');
    }

    const apiKey = process.env.WEATHERSTACK_API_KEY;
    const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(city)}`;

    try {
        const response = await axios.get(apiUrl);
        const weatherData = response.data;

        if (weatherData.error) {
            return res.status(400).send(weatherData.error.info);
        }

        res.json({
            location: weatherData.location.name,
            temperature: weatherData.current.temperature,
            weather_descriptions: weatherData.current.weather_descriptions,
            wind_speed: weatherData.current.wind_speed,
            humidity: weatherData.current.humidity
        });
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(port, () => {
    console.log(`Weather service running at http://localhost:${port}`);
});

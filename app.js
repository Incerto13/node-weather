const express = require('express');
const request = require('request');
const path = require('path');
const debug = require('debug');
const chalk = require('chalk');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const app = express();

const apiKey = process.env.openWeather_API_KEY;

app.set('view engine', 'ejs')
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render(
    'index',
    {
      weather: null,
      error: null,
    });
})

app.post('/', (req, res) => {
  const city = req.body.city;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  request(url, (err, response, body) => {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      // API returns data in JSON format
      const weather = JSON.parse(body);
      console.log(weather);
      if (weather == undefined || weather.cod == 404) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
      // valid entry and API works  
      const temp = Math.round(weather.main.temp);
      const maxTemp = Math.round(weather.main.temp_max);
      const minTemp = Math.round(weather.main.temp_min);
      const wind = Math.round(weather.wind.speed);
      
      const weatherText = `It's ${temp} degrees in ${weather.name} with 
      an expected high temp of ${maxTemp} and a low temp of ${minTemp}.
      The humidity is ${weather.main.humidity}% and wind gusts are up to ${wind} mph.`;

      res.render(
        'index',
        {
          weather: weatherText,
          error: null,
        }
      )
    }
  }
  });
})



app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')

const axios = require('axios');
const params = {
  access_key: process.env.AVIATION_STACK_ACCESS_KEY
}

let apiResponse;
let flight;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/api/flights/:departure', (req, res) => {
  axios.get('http://api.aviationstack.com/v1/flights', {params})
    .then(response => {
      apiResponse = response.data;
      // ------------------------------------------
      JSON.stringify(apiResponse)
      // console.log(apiResponse)
      // console.log(typeof apiResponse)
      // console.log(typeof apiResponse.data)
      console.log(apiResponse.data[0].departure)
      console.log(apiResponse.data[1].departure)
      console.log(apiResponse.data[2].departure)
      console.log(apiResponse.data[3].departure)

      flight = apiResponse.data.filter(flight => {
        return flight.departure.airport === req.params.departure
      })

      res.send(flight)
      
      if (Array.isArray(apiResponse['results'])) {
          apiResponse['results'].forEach(flight => {
              if (!flight['live']['is_ground']) {
                  console.log(`${flight['airline']['name']} flight ${flight['flight']['iata']}`,
                      `from ${flight['departure']['airport']} (${flight['departure']['iata']})`,
                      `to ${flight['arrival']['airport']} (${flight['arrival']['iata']}) is in the air.`);
              }
          });
      }
    }).catch(error => {
      console.log(error);
    });
})

app.listen(5050, (err) => {
  if (err) {
    console.log('Error happened', err)
  } else {
    console.log('server is running on port:8080')
  }
})

// debugs and logs

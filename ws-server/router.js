const request = require('request');
const {Router} = require('express')

const router = new Router()

router.get('/', (req, res) => {
  res.send('hello world')
})
router.get('/open-ai/billing', (req, res) => {
  getBilling()
    .then((response) => {
      res.json(JSON.parse(response))
    })
})
router.post('/open-ai/chat', (req, res) => {

  getGptAnswer(req.body)
    .then((response) => {
      if (response) {
        res.json(JSON.parse(response))
      } else {
        res.status(200).json({})
      }
    })
})

const headers = {
  'Authorization': 'Bearer fk216705-wd6Nzr06YJ07jRoZmsJirPYYvEwb6zEQ',
  'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
  'Content-Type': 'application/json'
}

function getBilling() {
  return new Promise((resolve, reject) => {
    const options = {
      'method': 'GET',
      'url': 'https://oa.api2d.net/dashboard/billing/credit_grants',
      'headers': headers,
    };
    request(options, function (error, response) {
      if (error) reject(error);
      if (response && response.body) {
        resolve(response.body)
      } else {
        resolve(response)
      }
      // console.log(response.body);
    });
  })

}

function getGptAnswer({message}) {
  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'url': 'https://oa.api2d.net/v1/chat/completions',
      'headers': headers,
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": message,
        "safe_mode": false
      })

    };
    request(options, function (error, response) {
      if (error) reject(error);
      resolve(response.body)
      // console.log(response.body);
    });
  })

}

router.post('/open-ai/draw', (req, res) => {
  console.log(req.body.question)
  getDrawImage(req.body)
    .then((response) => {
      res.json(JSON.parse(response))
    })
})


function getDrawImage({prompt, size}) {
  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'url': 'https://oa.api2d.net/v1/images/generations',
      'headers': headers,
      body: JSON.stringify({
        response_format: 'url',
        size: size,
        prompt: prompt
      })
    };
    request(options, function (error, response) {
      if (error) reject(error);
      resolve(response.body)
      // console.log(response.body);
    });
  })

}


module.exports = router

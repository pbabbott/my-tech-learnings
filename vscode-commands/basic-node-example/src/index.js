
const express = require('express')

const logic = require('./logic.js')

const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/random', (req, res) => {
    const result = logic.getRandomNumbers(req.query.quantity)
    res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})

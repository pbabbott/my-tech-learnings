import express from 'express'
import { getRandomNumbers } from './logic'

const app = express()
const port = 3000


app.get('/', (req, res) => {
  const message = 'hello from ts-docker-example!'
  res.send(message)
})

app.get('/random', (req, res) => {
    const quantity = parseInt(req.query.quantity as string)
    const result = getRandomNumbers(quantity)
    res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
})

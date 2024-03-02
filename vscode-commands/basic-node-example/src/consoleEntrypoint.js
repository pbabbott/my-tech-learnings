const logic = require('./logic.js')

console.log('Program start!')

console.log('Getting 10 random numbers')
const results = logic.getRandomNumbers(10)
console.log(results)

console.log('Program terminated!')
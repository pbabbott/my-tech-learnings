
const getRandomNumbers = (quantity) => {
    const items = []
    const max = 1000

    for (let i = 0; i < quantity; i++){
        items.push(Math.floor(Math.random() * max))
    }

    return items
}

module.exports = {
    getRandomNumbers
}
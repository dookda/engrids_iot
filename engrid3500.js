const express = require('express')
const app = express()
const port = 3500


const bodyParser = require("body-parser");
app.use(bodyParser.json()); //ทำให้รับ json จาก body ได้


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

app.use(express.static('www'))

const api = require('./service/api')
app.use(api)




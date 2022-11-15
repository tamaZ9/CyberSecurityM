const express = require('express')
const path = require('path')

const app = express()
const port = 3000;
const serverStartedMessage = `Express Server running on port ${port}`

const HOME = '/'
const LOGIN = '/login'

app.use(express.static(__dirname + '/public'))

app.get(HOME, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.post(LOGIN, (req, res) => {
    req.body
})

app.listen(port, () => {
    console.log(serverStartedMessage)
})
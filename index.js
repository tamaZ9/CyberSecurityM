const express = require('express')
const path = require('path')
const https = require('https')
const http = require('http')
const fs = require('fs')

const app = express()
const port = 443;
const serverStartedMessage = `Express Server running on port ${port}`

const HOME = '/'
const LOGIN = HOME + 'login'
const PUBLIC = HOME + 'public'

app.use(express.static(__dirname + PUBLIC))

app.all('*', switchToHttps)

app.get(HOME, (req, res) => {
    res.sendFile(path.join(__dirname, PUBLIC + '/login.html'))
})

app.post(LOGIN, (req, res) => {
    req.body
})


http.createServer(app).listen(80)
https.createServer(
    {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
    },
    app
).listen(port, () => {
    console.log(serverStartedMessage)
})

function switchToHttps(req, res, next){
    if (req.secure){
        return next()
    }

    res.redirect('https://' + req.hostname + req.url)
}
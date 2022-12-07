const express = require('express')
const path = require('path')
const https = require('https')
const http = require('http')
const fs = require('fs')
const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const cookieParser = require('cookie-parser')

const jwksHost = 'https://98b85250-91cc-4aea-a0e4-fd795b608081.hanko.io'

const HOME = '/'
const LOGIN = HOME + 'login'
const PUBLIC = HOME + 'public'
const SECURED = HOME + 'secured'
const ASSETSLINK = HOME + '.well-known/assetlinks.json'
const LOGINCALLBACK = HOME + 'loginCallback'

const app = express()
app.use(cookieParser())
app.use([SECURED, LOGINCALLBACK],jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 2,
        jwksUri: `${jwksHost}/.well-known/jwks.json`
    }),
    algorithms: [ 'RS256' ],
    getToken: function fromCookieOrHeader(req) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.hanko) {
            return req.cookies.hanko;
        }
        return null;
    }
}))

app.use(function(err, _req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(403).send({
        success: false,
        message: 'Devi effettuare il log-in prima di poter visualizzare questa pagina!'
      });
      return;
    }
 next();
});

const port = 443;
const serverStartedMessage = `Express Server running on port ${port}`

app.use(express.static(__dirname + PUBLIC))

app.all('*', switchToHttps)

app.get(HOME, (_req, res) => {
    res.sendFile(path.join(__dirname, PUBLIC + '/login.html'))
})

app.get(ASSETSLINK, (_req, res) => {
    res.type('application/json')
    res.sendFile(path.join(__dirname, PUBLIC + '/assetlinks.json'))
})

app.get(LOGINCALLBACK, (req, res) => {
    res.status(200).send({
        success: true,
        message: "Login effettuato con successo, ma per continuare devi installare l'app LiftTracker"
    });
})

app.get(SECURED, (req, res) => {
    if (!req.auth.sub) return res.sendStatus(401)
    res.sendStatus(200)
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
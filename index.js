const express = require('express')

const app = express()
const port = 3000;
const serverStartedMessage = `Express Server running on port ${port}`

const HOME = '/'

app.get(HOME, (req, res) => {
    //TODO: restituisci la pagina in cui inserire mail per registrarsi
})

app.listen(port, () => {
    console.log(serverStartedMessage)
})
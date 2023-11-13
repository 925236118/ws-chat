const express = require('express')
const app = new express()
const cors = require('cors')
const expressWs = require('express-ws')(app)

const router = require('./router')
const wsRouter = require('./wsRouter')

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use(router)
app.use('/chat', wsRouter)

app.listen(3000)

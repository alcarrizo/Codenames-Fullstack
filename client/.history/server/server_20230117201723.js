const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, "public")))


const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

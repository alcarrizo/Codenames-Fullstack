const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, "public")))

const connections = [null, null]

io.on('connection', socket => {
    let playerIndex = -1
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i
            break
        }
    }
    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)
    console.log(`Player ${playerIndex} has connected`)

    connections[playerIndex] = false

    // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex)

    // Handle Diconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null
        //Tell everyone what player numbe just disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    })


})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
})

const cors = require('cors')


app.use(cors())
app.use(express.static(path.join(__dirname, "public")))



app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world'
    })
})

const connections = [null, null]

var words = "Africa, Agent, Air, Alien, Alps, Amazon, Ambulance, America, Angel, Antarctica, Apple, Arm, Atlantis, Australia, Aztec, Back, Ball, Band, Bank, Bar, Bark, Bat, Battery, Beach, Bear, Beat, Bed, Beijing, Bell, Belt, Berlin, Bermuda, Berry, Bill, Block, Board, Bolt, Bomb, Bond, Boom, Boot, Bottle, Bow, Box, Bridge, Brush, Buck, Buffalo, Bug, Bugle, Button, Calf, Canada, Cap, Capital, Car, Card, Carrot, Casino, Cast, Cat, Cell, Centaur, Center, Chair, Change, Charge, Check, Chest, Chick, China, Chocolate, Church, Circle, Cliff, Cloak, Club, Code, Cold, Comic, Compound, Concert, Conductor, Contract, Cook, Copper, Cotton, Court, Cover, Crane, Crash, Cricket, Cross, Crown, Cycle, Czech, Dance, Date, Day, Death, Deck, Degree, Diamond, Dice, Dinosaur, Disease, Doctor, Dog, Draft, Dragon, Dress, Drill, Drop, Duck, Dwarf, Eagle, Egypt, Embassy, Engine, England, Europe, Eye, Face, Fair, Fall, Fan, Fence, Field, Fighter, Figure, File, Film, Fire, Fish, Flute, Fly, Foot, Force, Forest, Fork, France, Game, Gas, Genius, Germany, Ghost, Giant, Glass, Glove, Gold, Grace, Grass, Greece, Green, Ground, Ham, Hand, Hawk, Head, Heart, Helicopter, Himalayas, Hole, Hollywood, Honey, Hood, Hook, Horn, Horse, Horseshoe, Hospital, Hotel, Ice, Ice cream, India, Iron, Ivory, Jack, Jam, Jet, Jupiter, Kangaroo, Ketchup, Key, Kid, King, Kiwi, Knife, Knight, Lab, Lap, Laser, Lawyer, Lead, Lemon, Leprechaun, Life, Light, Limousine, Line, Link, Lion, Litter, Loch ness, Lock, Log, London, Luck, Mail, Mammoth, Maple, Marble, March, Mass, Match, Mercury, Mexico, Microscope, Millionaire, Mine, Mint, Missile, Model, Mole, Moon, Moscow, Mount, Mouse, Mouth, Mug, Nail, Needle, Net, New york, Night, Ninja, Note, Novel, Nurse, Nut, Octopus, Oil, Olive, Olympus, Opera, Orange, Organ, Palm, Pan, Pants, Paper, Parachute, Park, Part, Pass, Paste, Penguin, Phoenix, Piano, Pie, Pilot, Pin, Pipe, Pirate, Pistol, Pit, Pitch, Plane, Plastic, Plate, Platypus, Play, Plot, Point, Poison, Pole, Police, Pool, Port, Post, Pound, Press, Princess, Pumpkin, Pupil, Pyramid, Queen, Rabbit, Racket, Ray, Revolution, Ring, Robin, Robot, Rock, Rome, Root, Rose, Roulette, Round, Row, Ruler, Satellite, Saturn, Scale, School, Scientist, Scorpion, Screen, Scuba diver, Seal, Server, Shadow, Shakespeare, Shark, Ship, Shoe, Shop, Shot, Sink, Skyscraper, Slip, Slug, Smuggler, Snow, Snowman, Sock, Soldier, Soul, Sound, Space, Spell, Spider, Spike, Spine, Spot, Spring, Spy, Square, Stadium, Staff, Star, State, Stick, Stock, Straw, Stream, Strike, String, Sub, Suit, Superhero, Swing, Switch, Table, Tablet, Tag, Tail, Tap, Teacher, Telescope, Temple, Theater, Thief, Thumb, Tick, Tie, Time, Tokyo, Tooth, Torch, Tower, Track, Train, Triangle, Trip, Trunk, Tube, Turkey, Undertaker, Unicorn, Vacuum, Van, Vet, Wake, Wall, War, Washer, Washington, Watch, Water, Wave, Web, Well, Whale, Whip, Wind, Witch, Worm, Yard".split(',')

var Game = {
    id: null,
    players: [],
    cards: Array(25).fill({
        id: 0,
        word: null,
        team: 'beige',
        clicked: false
    }).map((c, i) => {
        return {
            ...c, id: i
        }
    }
    )
    ,
    redCards: [],
    blueCards: [],
    blackCards: [],
    cardWords: [],
    whoseTurn: null
}

const assignCards = (size, usedArr, arr, ranNum) => {
    // for loop to select 25 unique random words
    for (let i = 0; i < size; i++) {
        let randumNum = Math.round(Math.random() * ranNum)

        while (usedArr.includes(randumNum)) {
            randumNum = Math.round(Math.random() * ranNum)
        }
        usedArr.push(randumNum)
        arr.push(randumNum)
    }
}

const startGame = (game) => {
    //randomizing who goes first
    let randNum = Math.round(Math.random())
    game.whoseTurn = randNum === 0 ? 'blue' : 'red'

    // array to hold the words 
    game.cardWords = []
    // Keeps track of the selected words to avoid using the same word twice
    var usedWords = []

    // getting the 25 words to be used
    assignCards(25, usedWords, game.cardWords, 399)

    game.cardWords = game.cardWords.map(i => words[i])
    // assigning cards to teams
    // resetting the card team arrays
    game.redCards = []
    game.blueCards = []
    game.blackCards = []
    usedWords = []

    // The one who goes first gets 9 cards, otherwise they get 8
    let blueSize = game.whoseTurn === 'blue' ? 9 : 8
    let redSize = game.whoseTurn === 'red' ? 9 : 8

    // getting the black card
    assignCards(1, usedWords, game.blackCards, 24)

    // picking the blue cards
    assignCards(blueSize, usedWords, game.blueCards, 24)

    // picking the red cards
    assignCards(redSize, usedWords, game.redCards, 24)

    Game.cards = game.cards.map((c, i) => {
        let team = 'beige'
        if (Game.redCards.includes(i)) {
            team = 'red'
        }
        else if (Game.blueCards.includes(i)) {
            team = 'blue'
        }
        else if (Game.blackCards.includes(i)) {
            team = 'black'
        }
        return { ...c, clicked: false, word: Game.cardWords[i], team: team }
    })

}


io.on('connection', socket => {
    //socket.emit('connected',Game)
    console.log(`${socket.id} user just connected`)
    // socket.on('disconnect', () => {
    //     console.log('user has disconnected')
    // })

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

    // start game
    socket.on('start-game', () => {
        startGame(Game)
        console.log('test in progress')
        console.log(Game)
        //socket.broadcast.emit('Game-start', Game)
        //socket.emit('game-start', Game)
        io.sockets.emit('game-start', Game)
    })

    socket.on('reveal-card', (id) => {
        Game.cards[id].clicked = true
        io.sockets.emit('card-revealed', Game.cards)
    })

    // Handle Diconnect
    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`)
        Game.players = Game.players.filter(p => p.id !== socket.id)
        //Tell everyone what player numbe just disconnected
        socket.broadcast.emit('player-joined', Game.players)
    })
    // On Join
    socket.on('join-team', (player) => {
        player.id = socket.id
        Game.players.push(player)
        io.sockets.emit('player-joined', Game.players)
        console.log(Game.players)
    })


    // Timeout connection
    setTimeout(() => {
        connections[playerIndex] = null
        socket.emit('timeout')
        socket.disconnect()
    }, 600000) // 10 minute limit per player
})


const PORT = 8080
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

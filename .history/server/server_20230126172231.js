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
    gameStart: false,
    redCards: [],
    blueCards: [],
    blackCards: [],
    cardWords: [],
    whoseTurn: null,
    clue: null,
    clueNum: null,
    clueGiven: false,
    cardsPicked: 0,
    pickLimit: 0,
    clueLog: []
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

const startGame = () => {
    //randomizing who goes first
    let randNum = Math.round(Math.random())
    Game.whoseTurn = randNum === 0 ? 'blue' : 'red'
    Game.gameStart = true

    // array to hold the words 
    Game.cardWords = []
    // Keeps track of the selected words to avoid using the same word twice
    var usedWords = []

    // getting the 25 words to be used
    assignCards(25, usedWords, Game.cardWords, 399)

    Game.cardWords = Game.cardWords.map(i => words[i])
    // assigning cards to teams
    // resetting the card team arrays
    Game.redCards = []
    Game.blueCards = []
    Game.blackCards = []
    usedWords = []

    // The one who goes first gets 9 cards, otherwise they get 8
    let blueSize = Game.whoseTurn === 'blue' ? 9 : 8
    let redSize = Game.whoseTurn === 'red' ? 9 : 8

    // getting the black card
    assignCards(1, usedWords, Game.blackCards, 24)

    // picking the blue cards
    assignCards(blueSize, usedWords, Game.blueCards, 24)

    // picking the red cards
    assignCards(redSize, usedWords, Game.redCards, 24)

    Game.cards = Game.cards.map((c, i) => {
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
    let player = {
        name: 'Default',
        id: socket.id,
        team: null,
        role: null,
        joined: false
    }
    Game.players.push(player)

    socket.on('connect-player', player => {
        console.log(player)
        console.log(Game.players)
        var newPlayer = { ...player, id: socket.id }
        Game.players = Game.players.map(p => p.id === socket.id ? newPlayer : p)
        console.log(Game.players)
        socket.emit('connected', { game: Game, newPlayer: newPlayer })
        console.log(`${newPlayer.name} just connected`)
    })

    // start game
    socket.on('start-game', () => {
        startGame()
        //socket.broadcast.emit('Game-start', Game)
        //socket.emit('game-start', Game)
        io.sockets.emit('game-start', Game)
    })

    socket.on('reveal-card', (id) => {
        let player = Game.players.find(p => p.id === socket.id)
        console.log(player)
        console.log(player.team === Game.whoseTurn, player.role === 'operative', Game.clueGiven)
        if (player.team === Game.whoseTurn
            && player.role === 'operative'
            && Game.clueGiven) {

            Game.cards[id].clicked = true
            Game.cardsPicked += 1
            console.log(Game.cardsPicked, Game.pickLimit)

            if (Game.whoseTurn !== Game.cards[id].team
                || Game.cardsPicked === Game.pickLimit) {
                Game.whoseTurn = Game.whoseTurn === 'blue' ? 'red' : 'blue'
                Game.clueGiven = false
            }
        }

        io.sockets.emit('card-revealed', {
            cards: Game.cards,
            turn: Game.whoseTurn,
            clueGiven: Game.clueGiven
        })
    })

    // Handle Diconnect
    socket.on('disconnect', () => {
        let player = Game.players.find(p => p.id === socket.id)
        console.log('disconnect', Game.players)
        console.log(player)
        console.log(`Player ${player.name} disconnected`)
        Game.players = Game.players.filter(p => p.id !== socket.id)
        //Tell everyone what player numbe just disconnected
        socket.broadcast.emit('player-joined', Game.players)
    })
    // On Join
    socket.on('join-team', (player) => {
        console.log(Game.players)
        Game.players = Game.players.map(p => p.id === socket.id ? { ...player, id: socket.id } : p)
        io.sockets.emit('player-joined', Game.players)
    })

    socket.on('restart-game', () => {
        Game.gameStart = false
        Game.cards = Game.cards.map(c => {
            return {
                ...c,
                word: null,
                team: 'beige',
                clicked: false
            }
        })
        Game.blackCards = []
        Game.redCards = []
        Game.blueCards = []
        Game.players = Game.players = Game.players.map(p => {
            return { ...p, role: null, team: null }
        })
        Game.whoseTurn = null
        Game.clueLog = []
        io.sockets.emit('game-restarted', Game)
    })

    socket.on('give-clue', (clue) => {
        Game.clue = clue.word
        Game.clueNum = clue.num === '10' ? "&infin;" : clue.num
        Game.clueGiven = true
        Game.cardsPicked = 0
        Game.pickLimit = clue.num === '10' || clue.num === '0' ? 10 : Number(clue.num) + 1

        Game.clueLog.push(`${Game.whoseTurn}: ${clue.word} ${Game.clueNum}`)
        io.sockets.emit('clue-given', Game.clueLog)
    })

    socket.on('change-turn', () => {
        Game.whoseTurn = Game.whoseTurn === 'blue' ? 'red' : 'blue'
        Game.clueGiven = false
        io.sockets.emit('turn-change', Game)
    })

    // Timeout connection
    setTimeout(() => {
        Game.players = Game.players.filter(p => p.id !== socket.id)
        socket.emit('timeout')
        socket.disconnect()
    }, 600000) // 10 minute limit per player
})


const PORT = 8080
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

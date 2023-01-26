import './App.css';
import { useState, useEffect } from 'react';
import { io } from "../node_modules/socket.io/client-dist/socket.io";
const socket = io.connect('http://localhost:8080')

const Card = ({ card, revealCard, player }) => {

  var className = 'card '
  className = player.role === 'spymaster' ? className + card.team : className
  className = card.clicked ? "card " + card.team + ' picked' : className

  return (
    <div className={className} onClick={() => revealCard(card.id)}>
      {card.word === null ? 'temp' : card.word}
    </div >
  )
}

const PlayerInfo = ({ joinClass, className, joinTeam, numCards }) => {


  return (
    <div className={className + "Team"}>
      <p>operatives </p>
      <p id={className + '-operative-players'}></p>
      <Btn onClick={() => joinTeam(className, 'operative')} className={joinClass} id={className + '-join-operative'} name="Join operative" />
      <p>spymaster: </p>
      <p id={className + '-spymaster-players'}></p>
      <Btn onClick={() => joinTeam(className, 'spymaster')} className={joinClass} id={className + '-join-spymaster'} name="Join spymaster" />
      <p id={className + '-remaining-cards'}>{'cards: ' + numCards}</p>
    </div>
  )

}

const Btn = (props) => {
  return (
    <button id={props.id} onClick={props.onClick} className={props.className}>{props.name}</button>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25).fill({
    id: 0,
    word: null,
    team: 'beige',
    clicked: false
  }).map((c, i) => {
    return {
      ...c, id: i
    }
  }
  ))

  // player object
  const [player, setPlayer] = useState({
    name: 'Joker',
    id: null,
    team: null,
    role: null,
    joined: false
  })

  const [clueGiven, setClueGiven] = useState(false)

  // Keeps track of turns
  const [turn, setTurn] = useState('')
  document.body.className = turn

  const [gameStart, setGameStart] = useState(false)

  const [pickLimit, setPickLimit] = useState(0)

  // keeps tracks of how many cards have been clicked in a turn
  const [cardsPicked, setCardsPicked] = useState(0)


  // tells the server to start the game and
  // sends back the game information
  const startGame = () => {
    socket.emit('start-game')
  }
  const restart = () => {
    socket.emit('restart-game')
  }

  //reveals the clue class if the player is the spymaster, 
  //they have the turn, and a clue hasn't been given
  var clueClass = player.team === turn && player.role === 'spymaster' && !clueGiven ? 'clue-area' : 'clue-area hide'
  // revealing the end turn button if it's your turn and your role isn't spymaster
  var endClass = clueGiven === true && gameStart === true && player.team === turn && player.role !== 'spymaster' ? 'menuBtn' : 'menuBtn hide'

  // reveals/hides the join team buttons depending on whether the player has joined or not
  var joinClass = player.joined ? 'join-button hide' : 'join-button'

  var words = "Africa, Agent, Air, Alien, Alps, Amazon, Ambulance, America, Angel, Antarctica, Apple, Arm, Atlantis, Australia, Aztec, Back, Ball, Band, Bank, Bar, Bark, Bat, Battery, Beach, Bear, Beat, Bed, Beijing, Bell, Belt, Berlin, Bermuda, Berry, Bill, Block, Board, Bolt, Bomb, Bond, Boom, Boot, Bottle, Bow, Box, Bridge, Brush, Buck, Buffalo, Bug, Bugle, Button, Calf, Canada, Cap, Capital, Car, Card, Carrot, Casino, Cast, Cat, Cell, Centaur, Center, Chair, Change, Charge, Check, Chest, Chick, China, Chocolate, Church, Circle, Cliff, Cloak, Club, Code, Cold, Comic, Compound, Concert, Conductor, Contract, Cook, Copper, Cotton, Court, Cover, Crane, Crash, Cricket, Cross, Crown, Cycle, Czech, Dance, Date, Day, Death, Deck, Degree, Diamond, Dice, Dinosaur, Disease, Doctor, Dog, Draft, Dragon, Dress, Drill, Drop, Duck, Dwarf, Eagle, Egypt, Embassy, Engine, England, Europe, Eye, Face, Fair, Fall, Fan, Fence, Field, Fighter, Figure, File, Film, Fire, Fish, Flute, Fly, Foot, Force, Forest, Fork, France, Game, Gas, Genius, Germany, Ghost, Giant, Glass, Glove, Gold, Grace, Grass, Greece, Green, Ground, Ham, Hand, Hawk, Head, Heart, Helicopter, Himalayas, Hole, Hollywood, Honey, Hood, Hook, Horn, Horse, Horseshoe, Hospital, Hotel, Ice, Ice cream, India, Iron, Ivory, Jack, Jam, Jet, Jupiter, Kangaroo, Ketchup, Key, Kid, King, Kiwi, Knife, Knight, Lab, Lap, Laser, Lawyer, Lead, Lemon, Leprechaun, Life, Light, Limousine, Line, Link, Lion, Litter, Loch ness, Lock, Log, London, Luck, Mail, Mammoth, Maple, Marble, March, Mass, Match, Mercury, Mexico, Microscope, Millionaire, Mine, Mint, Missile, Model, Mole, Moon, Moscow, Mount, Mouse, Mouth, Mug, Nail, Needle, Net, New york, Night, Ninja, Note, Novel, Nurse, Nut, Octopus, Oil, Olive, Olympus, Opera, Orange, Organ, Palm, Pan, Pants, Paper, Parachute, Park, Part, Pass, Paste, Penguin, Phoenix, Piano, Pie, Pilot, Pin, Pipe, Pirate, Pistol, Pit, Pitch, Plane, Plastic, Plate, Platypus, Play, Plot, Point, Poison, Pole, Police, Pool, Port, Post, Pound, Press, Princess, Pumpkin, Pupil, Pyramid, Queen, Rabbit, Racket, Ray, Revolution, Ring, Robin, Robot, Rock, Rome, Root, Rose, Roulette, Round, Row, Ruler, Satellite, Saturn, Scale, School, Scientist, Scorpion, Screen, Scuba diver, Seal, Server, Shadow, Shakespeare, Shark, Ship, Shoe, Shop, Shot, Sink, Skyscraper, Slip, Slug, Smuggler, Snow, Snowman, Sock, Soldier, Soul, Sound, Space, Spell, Spider, Spike, Spine, Spot, Spring, Spy, Square, Stadium, Staff, Star, State, Stick, Stock, Straw, Stream, Strike, String, Sub, Suit, Superhero, Swing, Switch, Table, Tablet, Tag, Tail, Tap, Teacher, Telescope, Temple, Theater, Thief, Thumb, Tick, Tie, Time, Tokyo, Tooth, Torch, Tower, Track, Train, Triangle, Trip, Trunk, Tube, Turkey, Undertaker, Unicorn, Vacuum, Van, Vet, Wake, Wall, War, Washer, Washington, Watch, Water, Wave, Web, Well, Whale, Whip, Wind, Witch, Worm, Yard".split(',')

  //keeps track of how many cards the user can click given by the spymaster
  const revealCard = (id) => {
    socket.emit('reveal-card', id)
    const card = cards.find(c => c.id === id)
    //operatives can't click cards until a clue has been given
    if (!clueGiven) {
      return
    }
    // clicked cards can't be re-clicked
    if (card.clicked) {
      return
    }
    // makes it so that spymasters, the other team, and spectators
    //can't click cards during your turn
    if (player.role === 'spymaster' || player.team !== turn || !player.joined) {
      return
    }

    //prevents people from clicking the cards if the game hasn't
    // started/ ended
    if (!gameStart) {
      return
    }

  }


  const joinTeam = (team, role) => {
    const playerTeam = team === 'blue' ? 'blue' : 'red'
    const playerRole = role === 'operative' ? 'operative' : 'spymaster'

    const newPlayer = { ...player, role: playerRole, team: playerTeam, joined: true }

    socket.emit('join-team', newPlayer)
    //adding player's name to their role location
    //document.getElementById(playerTeam + "-" + playerRole + "-players").innerHTML += player.name + " "


    setPlayer(newPlayer)
  }

  const updateTeams = (players) => {
    // clearing the team name tags so nothing doubles up
    document.getElementById("blue-operative-players").innerHTML = " "
    document.getElementById("blue-spymaster-players").innerHTML = " "
    document.getElementById("red-operative-players").innerHTML = " "
    document.getElementById("red-spymaster-players").innerHTML = " "

    players.forEach(p => {
      console.log(p.role, p.role !== null)
      if (p.role !== null) {
        document.getElementById(p.team + "-" + p.role + "-players").innerHTML += p.name + " "
      }
    })
  }

  //checks if someone has won whenever a card is picked
  useEffect(() => {
    console.log(gameStart)
    if (!gameStart) {
      return
    }
    else {
      let newWin = false
      let winningTeam = ''
      if (cards.filter(c => c.team === 'blue' && !c.clicked).length === 0) {
        newWin = true
        winningTeam = 'blue'
      }
      else if (cards.filter(c => c.team === 'red' && !c.clicked).length === 0) {
        newWin = true
        winningTeam = 'red'
      }
      else if (cards.filter(c => c.team === 'black' && !c.clicked).length === 0) {
        newWin = true
        winningTeam = turn === 'blue' ? 'red' : 'blue'
      }

      if (newWin === true) {
        setGameStart(false)
        document.getElementById('win-screen').className = 'win-screen'
        document.getElementById('win-screen').innerHTML = winningTeam + ' has won'

        setCards(cards.map(c => { return { ...c, clicked: true } }))
        setTurn(winningTeam)
      }
    }
  }, [cards])

  // useEffect to hold socket listeners
  useEffect(() => {
    // gets the cards and starts the game
    socket.on('game-start', game => {
      console.log(game)
      setCards(game.cards)
      setGameStart(true)
      setTurn(game.whoseTurn)
    })

    // reveal a clicked card
    socket.on('card-revealed', result => {
      setCards(result.cards)
      if (result.turn !== turn) {
        setTurn(result.turn)
        setClueGiven(result.clueGiven)
        setCardsPicked(0)
      }
    })

    // when a player connects, they get the game
    // information (i.e. cards, players)
    socket.on('connected', game => {
      setCards(game.cards)
      setGameStart(game.gameStart)
      setTurn(game.whoseTurn)
      updateTeams(game.players)
      game.clueLog.forEach(line => {
        document.getElementById('clue-log').innerHTML += line + '<br>'
      });

    })

    // update teams when a player joined a team
    socket.on('player-joined', players => {
      updateTeams(players)
    })

    socket.on('game-restarted', game => {
      setTurn(game.whoseTurn)
      setCards(game.cards)
      updateTeams(game.players)
      setGameStart(game.gameStart)
      setPlayer({ ...player, team: null, role: null, joined: false })
      //bringing back the start game button
      document.getElementById('startBtn').className = 'menuBtn'

      //resetting the winScreen
      document.getElementById('win-screen').className = 'win-screen hide'

      //resetting the clue variables
      setClueGiven(false)
      setCardsPicked(0)
      setPickLimit(0)
      // resetting the clue log
      document.getElementById('clue-log').innerHTML = ''

    })

    socket.on('clue-given', log => {
      setClueGiven(true)
      //setPickLimit(clue.limit)
      document.getElementById('clue-log').innerHTML = ''
      console.log(turn)
      log.forEach(line => {
        document.getElementById('clue-log').innerHTML += line + '<br>'
      });

      //      document.getElementById('clue-log').innerHTML += turn + ': ' + clue.word + ' ' + clue.num + '<br>'


    })

    socket.on('turn-change', game => {
      setTurn(game.whoseTurn)
      setClueGiven(game.clueGiven)
      setCardsPicked(0)
    })

  }, [])

  const changeTurn = () => {
    socket.emit('change-turn')
  }

  const giveClue = () => {
    let clue = document.getElementById('clue-text').value
    let clueNum = document.getElementById('clueRange').value

    socket.emit('give-clue', { word: clue, num: clueNum })
    document.getElementById("clueRange").value = '0'
    document.getElementById('clue-text').value = ''
    document.getElementById("rangeNumber").innerHTML = "0"
  }

  const updateClueNum = () => {
    if (document.getElementById("clueRange").value === '10') {
      document.getElementById("rangeNumber").innerHTML = "&infin;"
    }
    else {
      document.getElementById("rangeNumber").innerHTML = document.getElementById("clueRange").value
    }
  }

  return (
    <div className="App">
      <div className='win-screen hide' id='win-screen'></div>

      {/* <button onClick={() => { giveClue('test') }}>test</button> */}

      <div className='wrapper'>
        <div className={"redSide"}>
          <PlayerInfo numCards={cards.filter(c => c.team === 'red' && !c.clicked).length} joinClass={joinClass} joinTeam={joinTeam} className={'red'} />
          <div className='menu'>
            <Btn className='menuBtn' onClick={() => startGame()} id="startBtn" name="Start Game" />
            <Btn className='menuBtn' onClick={() => restart()} id="resetBtn" name="Restart Game" />
          </div>
        </div>

        <div className='gameBoard'>
          {
            cards.map((card) =>
              <Card
                player={player}
                key={card.id}
                card={card}
                revealCard={revealCard} />
            )
          }

        </div>

        <div className={"blueSide"}>
          <PlayerInfo numCards={cards.filter(c => c.team === 'blue' && !c.clicked).length} joinClass={joinClass} joinTeam={joinTeam} className={'blue'} />
          <div id='clue-log' className='clue-log'></div>
          <Btn onClick={() => changeTurn()} className={endClass} id="endTurn" name="End Turn" />
        </div>


      </div>

      <div className={clueClass} id='clue-area'>
        <input className='clue-text' id='clue-text' type="text" />
        <div className="rangeDiv" id="rangeDiv">
          <input onChange={() => { updateClueNum() }} className="clue-range" id='clueRange' type="range" autoComplete='off' min="0" max="10" defaultValue="0" />
          <h3 className="range-number" id="rangeNumber">0</h3>
        </div>
        <Btn onClick={() => { giveClue() }} className="clue-submit" id="clue-submit" name="Give Clue" />
      </div>

      {/* <button onClick={() => startGame()}> test start </button>
      <button onClick={() => restart()}> test restart </button>
      <button onClick={() => giveClue()}> test give clue </button>
      <button onClick={() => changeTurn()}> test change Turn </button> */}
    </div>
  );
}

export default App;

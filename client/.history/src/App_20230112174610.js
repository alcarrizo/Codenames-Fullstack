import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

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

const PlayerInfo = ({ className, joinTeam }) => {
  return (
    <div className={className + "Team"}>
      <p>operatives </p>
      <p id={className + '-operative-players'}></p>
      <Btn onClick={() => joinTeam(className, 'operative')} className="join-button" id={className + '-join-operative'} name="Join operative" />
      <p>spymaster: </p>
      <p id={className + '-spymaster-players'}></p>
      <Btn onClick={() => joinTeam(className, 'spymaster')} className="join-button" id={className + '-join-spymaster'} name="Join spymaster" />
      <p id={className + '-remaining-cards'}></p>
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
    team: null,
    role: null,
    joined: false
  })

  document.getElementById("endTurn").className = player.team === turn ? 'menuBtn' : 'menuBtn hide'

  // Keeps track of turns
  const [turn, setTurn] = useState('')
  document.body.className = turn

  var words = "Africa, Agent, Air, Alien, Alps, Amazon, Ambulance, America, Angel, Antarctica, Apple, Arm, Atlantis, Australia, Aztec, Back, Ball, Band, Bank, Bar, Bark, Bat, Battery, Beach, Bear, Beat, Bed, Beijing, Bell, Belt, Berlin, Bermuda, Berry, Bill, Block, Board, Bolt, Bomb, Bond, Boom, Boot, Bottle, Bow, Box, Bridge, Brush, Buck, Buffalo, Bug, Bugle, Button, Calf, Canada, Cap, Capital, Car, Card, Carrot, Casino, Cast, Cat, Cell, Centaur, Center, Chair, Change, Charge, Check, Chest, Chick, China, Chocolate, Church, Circle, Cliff, Cloak, Club, Code, Cold, Comic, Compound, Concert, Conductor, Contract, Cook, Copper, Cotton, Court, Cover, Crane, Crash, Cricket, Cross, Crown, Cycle, Czech, Dance, Date, Day, Death, Deck, Degree, Diamond, Dice, Dinosaur, Disease, Doctor, Dog, Draft, Dragon, Dress, Drill, Drop, Duck, Dwarf, Eagle, Egypt, Embassy, Engine, England, Europe, Eye, Face, Fair, Fall, Fan, Fence, Field, Fighter, Figure, File, Film, Fire, Fish, Flute, Fly, Foot, Force, Forest, Fork, France, Game, Gas, Genius, Germany, Ghost, Giant, Glass, Glove, Gold, Grace, Grass, Greece, Green, Ground, Ham, Hand, Hawk, Head, Heart, Helicopter, Himalayas, Hole, Hollywood, Honey, Hood, Hook, Horn, Horse, Horseshoe, Hospital, Hotel, Ice, Ice cream, India, Iron, Ivory, Jack, Jam, Jet, Jupiter, Kangaroo, Ketchup, Key, Kid, King, Kiwi, Knife, Knight, Lab, Lap, Laser, Lawyer, Lead, Lemon, Leprechaun, Life, Light, Limousine, Line, Link, Lion, Litter, Loch ness, Lock, Log, London, Luck, Mail, Mammoth, Maple, Marble, March, Mass, Match, Mercury, Mexico, Microscope, Millionaire, Mine, Mint, Missile, Model, Mole, Moon, Moscow, Mount, Mouse, Mouth, Mug, Nail, Needle, Net, New york, Night, Ninja, Note, Novel, Nurse, Nut, Octopus, Oil, Olive, Olympus, Opera, Orange, Organ, Palm, Pan, Pants, Paper, Parachute, Park, Part, Pass, Paste, Penguin, Phoenix, Piano, Pie, Pilot, Pin, Pipe, Pirate, Pistol, Pit, Pitch, Plane, Plastic, Plate, Platypus, Play, Plot, Point, Poison, Pole, Police, Pool, Port, Post, Pound, Press, Princess, Pumpkin, Pupil, Pyramid, Queen, Rabbit, Racket, Ray, Revolution, Ring, Robin, Robot, Rock, Rome, Root, Rose, Roulette, Round, Row, Ruler, Satellite, Saturn, Scale, School, Scientist, Scorpion, Screen, Scuba diver, Seal, Server, Shadow, Shakespeare, Shark, Ship, Shoe, Shop, Shot, Sink, Skyscraper, Slip, Slug, Smuggler, Snow, Snowman, Sock, Soldier, Soul, Sound, Space, Spell, Spider, Spike, Spine, Spot, Spring, Spy, Square, Stadium, Staff, Star, State, Stick, Stock, Straw, Stream, Strike, String, Sub, Suit, Superhero, Swing, Switch, Table, Tablet, Tag, Tail, Tap, Teacher, Telescope, Temple, Theater, Thief, Thumb, Tick, Tie, Time, Tokyo, Tooth, Torch, Tower, Track, Train, Triangle, Trip, Trunk, Tube, Turkey, Undertaker, Unicorn, Vacuum, Van, Vet, Wake, Wall, War, Washer, Washington, Watch, Water, Wave, Web, Well, Whale, Whip, Wind, Witch, Worm, Yard".split(',')
  //arrays to hold which cards belong to the red team, blue team, and the death card
  var redCards = []
  var blueCards = []
  var blackCard = []

  const revealCard = (id) => {

    // makes it so that spymasters, the other team, and spectators
    // can't click cards during your turn
    // if (player.role === 'spymaster' || player.team !== turn || !player.joined) {
    //   return
    // }


    const card = cards.find(c => c.id === id)
    if (card.team !== turn) {
      changeTurn()
    }
    const revealedCard = { ...card, clicked: true }
    setCards(cards.map(c => c.id === id ? revealedCard : c))
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

  const changeTurn = () => {

    // revealing the end turn button if it's your turn otherwise hides it
    //document.getElementById("endTurn").className = player.team !== turn && player.joined ? 'menuBtn' : 'menuBtn hide'

    // changes turn to the opposite team
    const newTurn = turn === 'blue' ? 'red' : 'blue'
    setTurn(newTurn)
  }

  const startGame = () => {
    const whoseTurn = 'blue'
    setTurn(whoseTurn)

    // array to hold the words 
    var cardWords = []
    // Keeps track of the selected words to avoid using the same word twice
    var usedWords = []

    // getting the 25 words to be used
    assignCards(25, usedWords, cardWords, 399)

    cardWords = cardWords.map(i => words[i])
    // assigning cards to teams
    // resetting the card team arrays
    redCards = []
    blueCards = []
    blackCard = []
    usedWords = []


    // getting the black card
    assignCards(1, usedWords, blackCard, 24)

    // picking the blue cards
    assignCards(9, usedWords, blueCards, 24)

    // picking the red cards
    assignCards(8, usedWords, redCards, 24)

    const newCards = cards.map((c, i) => {
      let team = 'beige'
      if (redCards.includes(i)) {
        team = 'red'
      }
      else if (blueCards.includes(i)) {
        team = 'blue'
      }
      else if (blackCard.includes(i)) {
        team = 'black'
      }
      return { ...c, clicked: false, word: cardWords[i], team: team }
    })
    setCards(newCards)

    // removing the start game button since the game has started
    document.getElementById('startBtn').className += ' hide'

    // showing the end turn button if it's their team's turn

    //document.getElementById("endTurn").className = player.team === turn ? 'menuBtn' : 'menuBtn hide'
  }

  const joinTeam = (team, role) => {
    const playerTeam = team === 'blue' ? 'blue' : 'red'
    const playerRole = role === 'operative' ? 'operative' : 'spymaster'

    const newPlayer = { ...player, role: playerRole, team: playerTeam, joined: true }

    // removing join buttons when player joins
    document.getElementById('blue-join-operative').className += ' hide'
    document.getElementById('red-join-operative').className += ' hide'
    document.getElementById('blue-join-spymaster').className += ' hide'
    document.getElementById('red-join-spymaster').className += ' hide'

    //adding player's name to their role location
    document.getElementById(playerTeam + "-" + playerRole + "-players").innerHTML += player.name + " "

    // showing the end turn button if it's their team's turn
    //document.getElementById("endTurn").className = 'menuBtn'

    setPlayer(newPlayer)
  }

  const restart = () => {
    // bringing back the join buttons so players can join a team
    document.getElementById('blue-join-operative').className = 'join-button'
    document.getElementById('red-join-operative').className = 'join-button'
    document.getElementById('blue-join-spymaster').className = 'join-button'
    document.getElementById('red-join-spymaster').className = 'join-button'

    // clearing the team name tags
    document.getElementById("blue-operative-players").innerHTML = " "
    document.getElementById("blue-spymaster-players").innerHTML = " "
    document.getElementById("red-operative-players").innerHTML = " "
    document.getElementById("red-spymaster-players").innerHTML = " "

    // resetting the cards to pre game state
    const newCards = cards.map(c => {
      return {
        ...c,
        word: null,
        team: 'beige',
        clicked: false
      }
    })
    setCards(newCards)

    // resetting player to pre game state
    const newPlayer = {
      ...player,
      team: null,
      role: null,
      joined: false
    }
    setPlayer(newPlayer)

    //resetting Turns to pre game state
    setTurn('')

    //bringing back the start game button
    document.getElementById('startBtn').className = 'menuBtn'

    // Hiding the end turn button
    // document.getElementById("endTurn").className = 'menuBtn hide'
  }

  return (
    <div className="App">
      <h1>Codenames</h1>


      <div className='wrapper'>
        <div className={"redSide"}>
          <PlayerInfo joinTeam={joinTeam} className={'red'} />
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
          <PlayerInfo joinTeam={joinTeam} className={'blue'} />
          <div className='clue-log'></div>
          {/* <Btn onClick={() => changeTurn()} className='menuBtn hide' id="endTurn" name="End Turn" /> */}
        </div>

        <div className='win-screen hide' id='win-screen'></div>
      </div>

      <div className='clue-area hide' id='clue-area'>
        <input className='clue-text' id='clue-text' type="text" />
        <div className="rangeDiv" id="rangeDiv">
          <input className="clue-range" id='clueRange' type="range" autoComplete='off' min="0" max="10" defaultValue="0" />
          <h3 className="range-number" id="rangeNumber">0</h3>
        </div>
        <Btn className="clue-submit" id="clue-submit" name="Give Clue" />
      </div>

    </div>
  );
}

export default App;

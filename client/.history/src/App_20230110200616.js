import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Card = ({ card, revealCard }) => {

  const className = card.clicked ? "card " + card.team : 'card'
  return (
    <div className={className} onClick={() => revealCard(card.id)}>
      {card.word === null ? 'temp' : card.word}
    </div >
  )
}
const PlayerSide = ({ className, onClick }) => {
  if (className === 'red') {
    return (
      <div className={className + "Side"}>
        <PlayerInfo className={className} />
        <div className='menu'>
          <Btn className='menuBtn' onClick={onClick} id="startBtn" name="Start Game" />
          <Btn className='menuBtn' id="resetBtn" name="Reset Teams" />
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={className + "Side"}>
        <PlayerInfo className={className} />
        <div className='clue-log'></div>
        <Btn className='menuBtn' id="endTurn" name="End Turn" />
      </div>
    )
  }
}
const PlayerInfo = ({ className }) => {
  return (
    <div className={className + "Team"}>
      <p>operatives </p>
      <p id={className + '-operative-players'}></p>
      <Btn className="join-button" id={className + '-join-operative'} name="Join operative" />
      <p>spymaster: </p>
      <p id={className + '-spymaster-players'}></p>
      <Btn className="join-button" id={className + '-join-spymaster'} name="Join spymaster" />
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

  var words = 
  var words = 
  .split(',')
  const revealCard = (id) => {
    const card = cards.find(c => c.id === id)
    const revealedCard = { ...card, clicked: true }
    setCards(cards.map(c => c.id === id ? revealedCard : c))
  }
  const setUpCards = () => {

    console.log('temp')

    // array to hold the words 
    var cardWords = []
    // Keeps track of the selected words to avoid using the same word twice
    var usedWords = []
    // for loop to select 25 unique random words
    for (let i = 0; i < 25; i++) {
      let randumNum = Math.round(Math.random() * 399)

      while (usedWords.includes(randumNum)) {
        randumNum = Math.round(Math.random() * 399)
      }

      usedWords.push(randumNum)
      cardWords.push(words[randumNum])

    }

    const newCards = cards.map((c, i) => {
      console.log(words[cardWords[i]])
      return { ...c, word: words[cardWords[i]] }
    })
    console.log(newCards)

    setCards(newCards)

  }

  return (
    <div className="App">
      <h1>Codenames</h1>


      <div className='wrapper'>
        <PlayerSide onClick={() => setUpCards()} className="red" />

        <div className='gameBoard'>
          {
            cards.map((card) =>
              <Card
                key={card.id}
                card={card}
                revealCard={revealCard} />
            )
          }

        </div>

        <PlayerSide className="blue" />
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

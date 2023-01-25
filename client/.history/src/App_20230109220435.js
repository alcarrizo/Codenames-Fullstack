import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Wrapper = ({ cards, revealCard }) => {
  return (
    <div className='wrapper'>
      <PlayerSide className="red" />
      <Board revealCard={revealCard} cards={cards} />
      <PlayerSide className="blue" />
      <div className='win-screen hide' id='win-screen'></div>
    </div>
  )
}

const Card = ({ card, className, revealCard, cardId }) => {

  className = card.clicked ? className + " " + card.team : className
  return (
    <div className={className} onClick={() => revealCard(cardId)}>
      {card.word === null ? 'temp' : card.word}
    </div >
  )
}
const PlayerSide = ({ className }) => {
  if (className === 'red') {
    return (
      <div className={className + "Side"}>
        <PlayerInfo className={className} />
        <div className='menu'>
          <Btn className='menuBtn' id="startBtn" name="Start Game" />
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
    <button id={props.id} className={props.className}>{props.name}</button>
  )
}

const Board = ({ cards, revealCard }) => {

  return (
    <div className='gameBoard'>
      {
        cards.map((card, id) =>
          <Card
            key={id}
            cardId={id}
            className="card"
            card={card}
            revealCard={revealCard} />
        )
      }

    </div>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25).fill({
    id: 0,
    word: null,
    team: 'beige',
    clicked: false
  }).map((c) => {
    return c
  }))
  console.log(cards)

  const revealCard = (id) => {
    const revealedCard = {
      ...cards[id], clicked: !cards[id].clicked
    }
    const newCards = cards.map(c => c.word === revealedCard.word ? revealedCard : c)
  }


  return (
    <div className="App">
      <h1>Codenames</h1>

      <Wrapper revealCard={revealCard} cards={cards} />
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

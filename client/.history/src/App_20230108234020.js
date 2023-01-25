import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Wrapper = ({ cards }) => {
  return (
    <div className='wrapper'>
      <PlayerSide className="red" />
      <Board cards={cards} />
      <PlayerSide className="blue" />
    </div>
  )
}

const Card = ({ word, className }) => {

  return (
    <div className={className}>
      {word === null ? 'temp' : word}
    </div>
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
        <Btn className='menuBtn hide' id="endTurn" name="End Turn" />
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
const Board = ({ cards }) => {

  return (
    <div className='gameBoard'>

      {

        cards.map((card, id) =>
          <Card
            key={id}
            className="card"
            word={card} />

        )
      }

    </div>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25).fill(null))


  return (
    <div className="App">
      <h1>Codenames</h1>

      <Wrapper cards={cards} />
      <div className='clue-area' id='clue-area'>
        <input className='clue-text' id='clue-text' type="text" />
        <div className="rangeDiv" id="rangeDiv">
          <input className="clue-range" id='clueRange' type="range" autoComplete='off' min="0" max="10" defaultValue="0" />
          <h3 className="range-number" id="rangeNumber">0</h3>
        </div>
        <Btn className="clue-submit" />
      </div>

    </div>
  );
}

export default App;

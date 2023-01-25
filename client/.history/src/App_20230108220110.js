import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Wrapper = ({ cards }) => {
  return (
    <Board cards={cards} />
  )
}

const Card = ({ word, className }) => {
  // cWord = 'temp'

  // if (word) {
  //   cWord = word
  // }

  return (
    <div className={className}>
      {word === null ? 'temp' : word}
    </div>
  )
}
const PlayerInfo = ({ className }) => {
  return (
    <div className={className + "Side"}>

      <div className={className + "Team"}>

      </div>
    </div>
  )
}
const Btn = () => {
  return (
    <button>temp</button>
  )
}
const Board = ({ cards }) => {
  return (
    <div className='gameBoard'>
      <PlayerInfo className="red" />
      {

        cards.map(card =>
          <Card
            className="card"
            word={card} />
        )
      }
      <PlayerInfo className="blue" />

    </div>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25).fill(null))


  return (
    <div className="App">
      <h1>Codenames</h1>
      <Btn />
      <Board cards={cards} />
    </div>
  );
}

export default App;

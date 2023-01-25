import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Wrapper = ({ cards }) => {
  return (
    <div className='wrapper'>
      <PlayerInfo className="red" />
      <Board cards={cards} />
      <PlayerInfo className="blue" />
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
const PlayerInfo = ({ className }) => {
  if (className === 'red') {
    return (<div className='clue-log'></div>)
  }

}
const Btn = (props) => {
  return (
    <button id={props.id}>{props.name}</button>
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
    </div>
  );
}

export default App;

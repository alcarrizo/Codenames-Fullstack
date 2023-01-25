import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Card = ({ word, className }) => {
  // cWord = 'temp'

  // if (word) {
  //   cWord = word
  // }
  console.log(word)
  return (
    <div className={className}>
      {word ? 'temp' : word}
    </div>
  )
}
const PlayerInfo = () => {
  return (
    <>
      temp
    </>
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
      <Card className="card" word={cards[0]} />
    </div>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25).fill(null))


  return (
    <div className="App">
      <h1>Hello World</h1>
      <Btn />
      <Board cards={cards} />
    </div>
  );
}

export default App;

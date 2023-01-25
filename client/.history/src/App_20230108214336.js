import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Card = ({ word, className }) => {
  cWord = 'temp'
  if (word) {
    cWord = word
  }
  return (
    <div className={className}>
      temp
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
const Board = () => {
  return (
    <div className='gameBoard'>
      <Card />
    </div>
  )
}

const App = () => {

  const [cards, setCards] = useState(Array(25))


  return (
    <div className="App">
      <h1>Hello World</h1>
      <Btn />
      <Board cards={cards} />
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const Card = (props) => {
  return (
    <div className='card'>
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
      <Board />
    </div>
  );
}

export default App;

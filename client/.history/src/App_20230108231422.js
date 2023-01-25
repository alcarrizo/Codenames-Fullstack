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
      <PlayerInfo />
    )
  }
  else {
    return (
      <>
        <PlayerInfo />
        <div className='clue-log'></div>
      </>
    )
  }
}
const PlayerInfo = ({ className }) => {
  return (
    <div className={className + "Side"}>

      <div className={className + "Team"}>
        <p>operatives </p>
        <p id={className + '-operative-players'}></p>
        <Btn id={className + '-join-operative'} name="Join operative" />
        <p>spymaster: </p>
        <p id={className + '-spymaster-players'}></p>
        <Btn id={className + '-join-spymaster'} name="Join spymaster" />
        <p id={className + '-remaining-cards'}></p>
      </div>


    </div>
  )

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

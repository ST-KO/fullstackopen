import { useState } from 'react'

const Hello = (props) => {
  console.log(props);
  
  return(
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
};

const History = (props) => {
  if(props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () =>  {
  // const name = 'Peter';
  // const age = 10;

  // const friends = ['Peter', 'Maya'];

  // return (
  //   <>
  //     <h1>Greetings</h1>
  //     <Hello name='Maya' age={26 + 10} />
  //     <Hello name={name} age={age} />
  //     <p>{friends}</p>
  //   </>
  // )

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [allClicks, setAllClicks] = useState([]);
  const [total, setTotal] = useState(0);

  const [value, setValue] = useState(10);

  // const hello = (who) => {
  //   const handler = () => console.log('Hello', who);
  //   return handler;
  // }

  const setToValue = (newValue) => () => {
    console.log('value now', newValue);
    setValue(newValue);
  }

  const handleLeftClick = () => {
    setAllClicks(allClicks.concat('L'));
    const updateLeft = left + 1;
    setLeft(updateLeft);
    setTotal(updateLeft + right);
  }

  const handleRightClick = () => {
    setAllClicks(allClicks.concat('R'));
    setRight(right + 1);
    setTotal(left + right);
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}

export default App

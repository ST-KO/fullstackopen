import React, { useState } from 'react'; 

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
};

const StaticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all, average, positive}) => {
  if(all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return(
    <table>
      <tbody>
        <StaticLine text={'good'} value={good} />
        <StaticLine text={'neutral'} value={neutral} />
        <StaticLine text={'bad'} value={bad} />
        <StaticLine text={'all'} value={all} />
        <StaticLine text={'average'} value={average} />
        <StaticLine text={'positive'} value={`${positive} %`} />
      </tbody>
    </table>
  );
}

const App = () => {
  
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);

  const handleGoodClick = () => {
    const updateGood = good + 1;
    setGood(updateGood);
    setAll(updateGood + neutral + bad);
  }

  const handleNeutralClick = () => {
    const updateNeutral = neutral + 1;
    setNeutral(updateNeutral);
    setAll(updateNeutral + good + bad);
  }

  const handleBadClick = () => {
    const updateBad = bad + 1;
    setBad(updateBad);
    setAll(updateBad + good + neutral);
  }

  
  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handleGoodClick} text={'good'} />
      <Button handleClick={handleNeutralClick} text={'neutral'} />
      <Button handleClick={handleBadClick} text={'bad'} />
      <h2>statistics</h2>
      <Statistics 
        good={good} 
        bad={bad} 
        neutral={neutral} 
        all={all} 
        average={(good - bad) / all} 
        positive={(good * 100) / all}
      />
    </div>
  );
};

export default App;
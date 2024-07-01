import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const points = Array(anecdotes.length).fill(0);
  const [votes, setVotes] = useState([...points]);
  const [selected, setSelected] = useState(0);
  console.log(votes)
  const handleClick = () => setSelected(Math.floor(Math.random() * anecdotes.length)); 

  const handleVote = () => {
    setVotes(prevVotes => 
      prevVotes.map((vote, index) => 
        index === selected ? vote + 1 : vote)
    );
  };

  const highestVote = Math.max(...votes);
  const highestVoteIndex = votes.indexOf(highestVote);

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <div>
        <button onClick={handleVote}>vote</button>
        <button onClick={handleClick}>next anecdote</button>
      </div>
      <h2>Anecdote with most votes</h2>
      {anecdotes[highestVoteIndex]}
      <p>has {votes[highestVoteIndex]} votes</p>
    </div>
  )
}

export default App
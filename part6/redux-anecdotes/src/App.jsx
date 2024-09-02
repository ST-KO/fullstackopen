import NewAnecdote from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList.jsx'

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <h2>create new</h2>
     <NewAnecdote />
    </div>
  )
}

export default App
import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer"; 

const Anecdotes = () => {
    const dispatch = useDispatch();
    const anecdotes = useSelector(({ anecdotes, filter }) => {
        if(!filter) return anecdotes;
        return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    });

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    return(
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
                </div>
                </div>
            )}
        </div>
    )
}

export default Anecdotes;
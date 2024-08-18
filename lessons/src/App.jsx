import { useEffect, useState, useRef } from "react";
import Note from "./components/Note";
import noteService from './services/notes';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import './index.css';
import NoteForm from "./components/NoteForm";

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  );
};

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  // const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote));
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setNotes(notes.filter(n => n.id !== id));
    });
  };
  
  const addNote = (noteObject) => {
    // noteFormRef.current.toggleImportance();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
      });
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const user = await loginService.login({
        username, password
      });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user); // Save server response (token, the user details)
      setUsername('');
      setPassword('');
    } catch (error) {

      setErrorMessage('Wrong credentials');

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
         <LoginForm 
            handleLogin={handleLogin}
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
      </Togglable>
    );
  };
  
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef} >
      <NoteForm createNote={addNote} />
    </Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>
      {
        errorMessage && <Notification message={errorMessage} />
      }

      {
        user === null ? 
        loginForm() :
        <div>
          <p>{user.username} logged-in</p>
          {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />
          )
        }
      </ul>

      <Footer />
    </div>
  );
};

export default App
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

import './index.css';

const App = () => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  });
  const [blogs, setBlogs] = useState([]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    try {
      const response = await blogService.create(blogObject);

      setBlogs(blogs.concat(response));
      setNewBlog(prev => ({
        title: '',
        author: '',
        url: ''
      }));

      setNotificationMessage(`a new blog ${response.title} by ${response.author} added`);
       
    } catch (error) {
      setError(true);
      setNotificationMessage('Error creating new blog');

      setTimeout(() => {
        setNotificationMessage(null);
        setError(false);
      }, 5000);
    }
  }

  const handleBlogChange = (event) => {
    console.log(event.target.value);
    const { value, name } = event.target;
    setNewBlog(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('')

    } catch (error) {
      setError(true);
      setNotificationMessage('Wrong credentials');

      setTimeout(() => {
        setNotificationMessage(null);
        setError(false);
      }, 5000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <div>
          username 
            <input 
              type="text" 
              value={username} 
              name='Username' 
              onChange={({target}) => setUsername(target.value)} 
            />
        </div>
        <div>
          password
            <input 
              type="password" 
              value={password}
              name="Password"
              onChange={({target}) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title: 
            <input 
              type="text" 
              value={newBlog.title} 
              name="title" 
              onChange={handleBlogChange} 
            />
        </div>
        <div>
          author: 
            <input 
              type="text" 
              value={newBlog.author} 
              name="author" 
              onChange={handleBlogChange} 
            />
        </div>
        <div>
          url: 
            <input 
              type="text" 
              value={newBlog.url} 
              name="url" 
              onChange={handleBlogChange} 
            />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )

  const blogList = () => (
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
  )

  return (
    <div>
      <h2>blogs</h2>
      {
        notificationMessage && <Notification message={notificationMessage} error={error} />
      }

      {
        user === null ?
        loginForm() :
        <div>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App
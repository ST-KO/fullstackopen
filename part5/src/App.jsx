import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

import './index.css';
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {

  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [error, setError] = useState(false);

  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs( blogs );
    })  
  }, [reloadPage]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject);

      setBlogs(blogs.concat(response));

      setNotificationMessage(`a new blog ${response.title} by ${response.author} added`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);

    } catch (error) {
      setError(true);
      setNotificationMessage('Error creating new blog');

      setTimeout(() => {
        setNotificationMessage(null);
        setError(false);
      }, 5000);
    }
  }

  const addLikes = async (id, blogObject) => {
    try {
      await blogService.update(id, blogObject);
      setReloadPage(!reloadPage);

      setNotificationMessage(`a new like is added to ${blogObject.title}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setError(true);

      setNotificationMessage('Error updating the blog');
      setTimeout(() => {
        setNotificationMessage(null);
        setError(false);
      }, 5000);
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setReloadPage(!reloadPage);

      setNotificationMessage(`a blog has been successfully deleted`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setError(true);

      setNotificationMessage('Error deleting the blog');
      setTimeout(() => {
        setNotificationMessage(null);
        setError(false);
      }, 5000);
    }
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
    <Togglable buttonLabel='login'>
      <LoginForm 
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel='new blog'>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    blogs.map(blog =>
      <section className='blogs'>
        <Blog key={blog.id} blog={blog} updateLikes={addLikes} deleteBlog={deleteBlog} user={user} />
      </section>
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
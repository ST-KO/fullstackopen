import PropTypes from 'prop-types';

const loginForm = ({ 
    handleLogin, 
    handleUsernameChange, 
    handlePasswordChange, 
    username, 
    password 
}) => (
    <form onSubmit={handleLogin}>
      <div>
        username 
          <input 
            type="text" 
            value={username} 
            name='Username' 
            onChange={handleUsernameChange} 
            id='username'
          />
      </div>
      <div>
        password
          <input 
            type="password" 
            value={password}
            name="Password"
            onChange={handlePasswordChange}
            id='password'
          />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
);

loginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired, 
  handleUsernameChange: PropTypes.func.isRequired, 
  handlePasswordChange: PropTypes.func.isRequired, 
  username: PropTypes.string.isRequired, 
  password: PropTypes.string.isRequired 
}

export default loginForm;
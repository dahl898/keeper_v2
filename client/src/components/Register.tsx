import React, {useState} from 'react';
import App from '../App';

function Register(){

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const [match, setMatch] = useState(true);
  const [check, setCheck] = useState('');
  const [registered, setRegistered] = useState(false);
  const [exists, setExists] = useState(false);

  async function handleSubmit(){
    setExists(false);
    const response = await fetch('/register', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    const data = await response.json();
    if (data?.isReg) {
      setRegistered(true)
    }else if (data?.msg) {
      setCredentials({
        username: '',
        password: ''
      })
      setCheck('')
      setExists(true)
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCredentials((prevValue) => {
      return ({...prevValue, [name]: value})
    })
  }

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target
    setCheck(value);
    if (value !== credentials.password) {
      setMatch(false)
    }else{
      setMatch(true)
    }
  }

  return (
    registered ? (
      <App />
    ) : 
    (<div className='register-container'>
      <div className='register'>
        <div>
        <h1>Sign up!</h1>
        <form>
          <div className='txtField'>
            <input type='text' name='username' onChange={handleChange} value={credentials.username} required/>
            <span></span>
            <label>Username</label>
          </div>
          {exists && <p className='warning'>User with such username already exists, please log in or pick different username</p>}
          <div className='txtField'>
            <input type='password' name='password' onChange={handleChange} value={credentials.password} required/>
            <span></span>
            <label>Password</label>
          </div>
          <div className='txtField'>
            <input type='password' name='passwordCheck' onChange={handleCheck} value={check} required/>
            <span></span>
            <label>Repeat Password</label>
          </div>
          {!match && <p className="warning">Passwords do not match!</p>}
          <div>
          <div className="btn-container">
          {check === '' || credentials.password === '' || credentials.username === '' || !match ? <button type='button' className='register-btn' disabled>Submit</button> : <button type='button' className='register-btn' onClick={handleSubmit}>Submit</button>}
          </div>
          <div className='login-link'>
          <a onClick={() => setRegistered(true)}>Go back to login page</a>
          {/* <button type="button" onClick={() => setRegistered(false)}>Register</button> */}
          </div>
          </div>
          </form>
          </div>
      </div>
    </div>))
}

export default Register;
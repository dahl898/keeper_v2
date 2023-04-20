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
  
  let message: string | undefined;

  async function handleSubmit(){
    setExists(false);
    await fetch('/register', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then((data) => {
      if (data?.isReg) {
        setRegistered(true)
      }else if (data?.msg) {
        console.log('else if reached')
        message = data.msg;
        setCredentials({
          username: '',
          password: ''
        })
        setCheck('')
        setExists(true)
      }
    })
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
    (<div className='register'>
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
         {check === '' || credentials.password === '' || credentials.username === '' || !match ? <button type='button' className='login-btn' disabled>Submit</button> : <button type='button' className='login-btn' onClick={handleSubmit}>Submit</button>}
        <div className='login-link'>
        <a onClick={() => setRegistered(true)}>Go back to login page</a>
        {/* <button type="button" onClick={() => setRegistered(false)}>Register</button> */}
        </div>
        </div>
        </form>
        </div>
    </div>))
}

export default Register;
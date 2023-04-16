import React, { useState } from 'react'
import Register from './Register'


function Login({ auth } : {auth: Function}) {
  const [registered, setRegistered] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [failedAuth, setFailedAuth] = useState(false);

  async function handleSubmit(){
    await fetch('http://localhost:5000/login', {
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
      auth(data.isAuth);
      setFailedAuth(true);
    })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCredentials((prevValue) => {
      return ({...prevValue, [name]: value})
    })
  }


  if (registered) {
    return(
      <div className='login'>
    <div>
      <h1>Log in!</h1>
    <form>
      <div className="txtField">
        <input type="text" name="username" value={credentials.username} onChange={handleChange} required/>
        <span></span>
        <label>Username</label>
      </div>
      <div className="txtField">
        <input type="password" name="password" value={credentials.password} onChange={handleChange} required/>
        <span></span>
        <label>Password</label>
      </div>
      {failedAuth && <p className='warning'>Either username or password are incorrect...</p>}
      <div>
        <button className="login-btn" type="button" onClick={handleSubmit}>Log in</button>
      </div>
      <div className='signup-link'>
        New here? <a onClick={() => setRegistered(false)}>Sign up</a>
        {/* <button type="button" onClick={() => setRegistered(false)}>Register</button> */}
      </div>
    </form>
    </div>
    </div>
    )
  }else{
    return(
      <Register />
    )
  }
  // return(
  // <div className='login'>
  //   {registered ? 
  //   (<div>
  //     <h1>Login</h1>
  //   <form>
  //     <div className="txtField">
  //       <input type="text" name="username" value={credentials.username} onChange={handleChange} required/>
  //       <span></span>
  //       <label>Username</label>
  //     </div>
  //     <div className="txtField">
  //       <input type="password" name="password" value={credentials.password} onChange={handleChange} required/>
  //       <span></span>
  //       <label>Password</label>
  //     </div>
  //     <div>
  //       <button className="login-btn" type="button" onClick={handleSubmit}>Log in</button>
  //     </div>
  //     <div className='signup-link'>
  //       New here? <a onClick={() => setRegistered(false)}>Sign up</a>
  //       {/* <button type="button" onClick={() => setRegistered(false)}>Register</button> */}
  //     </div>
  //   </form>
  //   </div>)
  //   :
  //   <Register />
  // }
  // </div>
  // )
}

export default Login
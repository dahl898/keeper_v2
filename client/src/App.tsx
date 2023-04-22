import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import { TNote } from './interfaces/interfaces';
import CreateArea from './components/CreateArea';
import Header from './components/Header';
import Login from './components/Login';
import Page from './components/Page';

function App() {

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    const response = await fetch('/login',  {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    const data = await response.json();
    setIsAuth(data?.isAuth)
    setLoading(false)
  }

  fetchData()

  if (loading) {
    return(
    <div className='spinner'></div>
    )
  }else if (isAuth) {
    return(
      <Page setIsAuth={setIsAuth}/>
    )
  }else{
    return(
      <Login auth={setIsAuth}/>
    )
  }
}

export default App;

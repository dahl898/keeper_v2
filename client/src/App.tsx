import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import { TNote } from './interfaces/interfaces';
import CreateArea from './components/CreateArea';
import Header from './components/Header'
import Login from './components/Login'
import Page from './components/Page'

function App() {

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    const response = await fetch('https://aqueous-reef-83032.herokuapp.com/login',  {
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    })
    .then (response => response.json())
    .then ((data) => {
      setIsAuth(data?.isAuth)
      setLoading(false)
    });
    }

    fetchData()
  if (loading) {
    return(
    <div className='spinner'></div>
    )
  }else if (isAuth) {
    return(
      <Page />
    )
  }else{
    return(
      <Login auth={setIsAuth}/>
    )
  }
  // return (
      
    
  //     {loading ? <div className='spinner'></div> : isAuth ? <Page /> : <Login auth={setIsAuth}/>}
  // )

  
}

export default App;

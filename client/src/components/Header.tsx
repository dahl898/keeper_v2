import React, { useState } from 'react';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

function Header({ setIsAuth } : {setIsAuth: Function}) {

  const [logout, setLogout] = useState(false);

  async function handleClick () {
    const response = await fetch('/logout', {
      credentials: 'include',
      mode: 'cors'
    })
    const data = await response.json();
    setLogout(data.logout)
    setIsAuth(false)
  }
  return(
    <header>
      <h1>
        <NoteAltIcon />
        Keeper
      </h1>
      <ExitToAppOutlinedIcon className='exit-button' onClick={handleClick}/>
    </header>
  )
}

export default Header;
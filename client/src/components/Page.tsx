import React, { useState, useEffect } from 'react';
import Note from './Note';
import { TNote } from '../interfaces/interfaces';
import CreateArea from './CreateArea';
import Header from './Header';
import Login from './Login';

function Page({ setIsAuth } : {setIsAuth: Function}) {
const [notes, setNotes] = useState<TNote[]>([])

const addNote = async (newNote: TNote): Promise<void> => {
  const response = await fetch('/api', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      })
  const data = await response.json()
  setNotes((prevNotes) => {
    console.log(data)
    console.log(prevNotes)
    return [...prevNotes, data]
  })      
  }

const deleteNote = async (note: TNote): Promise<void> => {
  const response = await fetch('/api', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  setNotes((prevNotes) =>{
    return (prevNotes.filter(item => item._id !== note._id))
  })
}

  const fetchData = async () => {
    const response = await fetch('/api', {
      credentials: 'include'
    })
    const data = await response.json()
    setNotes(data)
  }

  useEffect(() => {
      fetchData()
    }, []);

  return (
    <div className="Page">
      <Header setIsAuth={setIsAuth}/>
      <CreateArea 
      onAdd={addNote}/>
      <div style={{paddingLeft: '70px', paddingRight: '70px'}}>
      {notes.map((note, index) => {
        return(
          <Note
          onDelete={deleteNote}
          key={note._id}
          _id={note._id}
          title={note.title}
          content={note.content}
          />
        )
      })}
      </div>
    </div>
  );
}

export default Page;
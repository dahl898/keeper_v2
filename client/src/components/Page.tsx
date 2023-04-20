import React, { useState, useEffect } from 'react';
import Note from './Note';
import { TNote } from '../interfaces/interfaces';
import CreateArea from './CreateArea';
import Header from './Header';
import Login from './Login';

function Page({ setIsAuth } : {setIsAuth: Function}) {
const [notes, setNotes] = useState<TNote[]>([])

const addNote = async (newNote: TNote): Promise<void> => {
  await fetch('/api', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      })
    .then(() => setNotes((prevNotes) => {
      console.log('usestate hook')
      return [...prevNotes, newNote]
    }))
      
  }

const deleteNote = async (note: TNote): Promise<void> => {
  console.log('delete clicked')
  await fetch('/api', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  // .then(response => response.json())
  .then(data => setNotes((prevNotes) =>{
    return (prevNotes.filter(item => item._id !== note._id))
  }))
}

  const fetchData = async () => {
    const response = await fetch('/api', {
      credentials: 'include'
    })
    .then (response => response.json())
    .then (data => setNotes(data));
    }

  useEffect(() => {
      console.log('useeffect hook')
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
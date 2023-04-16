import React, { useState, useEffect } from 'react';
import Note from './Note';
import { TNote } from '../interfaces/interfaces';
import CreateArea from './CreateArea';
import Header from './Header'
import Login from './Login'

function Page() {
const [notes, setNotes] = useState<TNote[]>([])

const addNote = async (newNote: TNote): Promise<void> => {
  const data = await fetch('http://localhost:5000/api', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      })
      .then(res => res.json())
      .then(data => setNotes(data))
  }

const deleteNote = async (note: TNote): Promise<void> => {
  console.log('delete clicked')
  await fetch('http://localhost:5000/api', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  })
  .then(response => response.json())
  .then(data => setNotes(data))
}

  const fetchData = async () => {
    const response = await fetch('http://localhost:5000/api', {
      credentials: 'include'
    })
    .then (response => response.json())
    .then (data => setNotes(data));
    }

  useEffect(() => {
      fetchData()
    }, []);

  return (
    <div className="Page">
      <Header />
      <CreateArea 
      onAdd={addNote}/>
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
  );
}

export default Page;
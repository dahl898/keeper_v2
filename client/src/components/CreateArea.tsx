import React, { useState } from 'react';
import { TNote } from '../interfaces/interfaces';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


function CreateArea( { onAdd }: {
  onAdd: Function
}) {
  const [note, setNote] = useState<TNote>({
    title: '',
    content: ''
  });

  const [expanded, setExpanded] = useState<boolean>(false) 
  
  function handleChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target
    setNote((prevNote: TNote): TNote => {
      return {
        ...prevNote,
        [name]: value
      }
    })
  }
  
  function handleSubmit(event: React.FormEvent<HTMLButtonElement>){
    onAdd(note)
    setNote({
      title: '',
      content: ''
    })
    event.preventDefault();
  }

  function handleClick (){
    setExpanded(true);
  }

  return(
  <div>
    <form className='create-note'>
      {expanded && (
      <input 
        name="title"
        onChange={handleChange}
        placeholder="Title"
        value={note.title}
      />)}
      <textarea 
        name="content"
        onChange={handleChange}
        onClick={handleClick}
        placeholder="Take a note..."
        value={note.content}
        rows={expanded? 3 : 1}
      />
      <Zoom in={expanded}>
        <Fab 
          type='submit'
          onClick={handleSubmit}>
            <AddIcon />
        </Fab>
      </Zoom>
    </form>
  </div>
  )
}

export default CreateArea;
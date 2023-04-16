import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Note ({ _id, title, content, onDelete }: {
  _id?: string,
  title: string,
  content: string,
  onDelete: Function
}) 
{
  function handleClick() {
    return onDelete({
      _id: _id,
      title: title,
      content: content
    })
  }
  return (
    <div className='note'>
      <h1>{title}</h1>
      <p>{content}</p>
      <button onClick={handleClick}>
      <DeleteForeverIcon/>
      </button>
    </div>
  )
}

export default Note;
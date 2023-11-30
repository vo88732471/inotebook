import React,{useContext, useState} from 'react'
import NoteContext from '../context/notes/NoteContext';

const AddNote = () => {
    const context = useContext(NoteContext);
    const {addNote}=context;
    
    const [note,setNote] = useState({title:"", description:"",tag:""})
    
    const onChange=(e) =>{
        setNote((p)=>({...p,[e.target.name]: e.target.value}));
       }
       
    const handleClick =(e)=>{
       e.preventDefault();
      addNote(note.title,note.description,note.tag);
      setNote({title:"", description:"",tag:""})
    }
   
  return (
    <div className="container v-100" >
        <div className="shadow bg-light"> 
        <div className='m-4 p-4'>
    <h2>Add a Note</h2>
       <form className='container my-3'>
  <div className="mb-3">
    <label htmlFor="title" className="form-label fw-bold">Title</label>
    <input type="text" className="form-control border" id="title"  name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required/>
   
  </div>
  <div className="mb-3">
    <label htmlFor="description " className="form-label fw-bold">Description</label>
    <textarea type="text" className="form-control border" id="description" name="description" rows="3" value={note.description} onChange={onChange} minLength={5} required />
  </div>
  <div className="mb-3">
    <label htmlFor="tag" className="form-label fw-bold">Tag</label>
    <input type="text" className="form-control border" id="tag"  name="tag" value={note.tag} onChange={onChange} />
  </div>
  
  <button type="button" disabled={note.title.length<5 || note.description.length<5} className="btn btn-warning" onClick={handleClick}>Add Note</button>
</form>
</div>
</div>
</div>
  )
}

export default AddNote
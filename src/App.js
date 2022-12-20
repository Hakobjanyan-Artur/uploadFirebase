import { useEffect, useRef, useState } from 'react';
import './App.css';
import {db} from "./firebase-config"
import {collection, getDocs, addDoc, updateDoc, doc, deleteDoc} from 'firebase/firestore'
import { getDownloadURL,ref, uploadBytesResumable } from "@firebase/storage"
import { storage } from './firebase-config'


function App() {
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState(0)
  const formRef = useRef(null)
  const [users, setUsers] = useState([])
  const [progress, setProgress] = useState(0)
  const errRef = useRef(null)

  const usersCollectionRef = collection(db, "users")

  useEffect(() => {
    getUsers()
  }, [])


  const getUsers = async () => {

    const data = await getDocs(usersCollectionRef)

    setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  
  }

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id)
    const newFileds = {age: age + 1}
    await updateDoc(userDoc, newFileds)
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id)
    await deleteDoc(userDoc)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    
    let file = formRef.current[2].files[0]
    
    if (file.size > 1048576) {
      errRef.current.style.display = 'block'
    }else {
      const uploadFile = (file) => {
  
        if (!file) return
          const storageRef = ref(storage, `/files/${file.name}`)
          const uploadTask = uploadBytesResumable(storageRef, file)
    
          uploadTask.on("state_changed", (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(prog)
            
          }, 
          (err) => {console.log('error')
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(url => {
            const createUser = async () => {
              await addDoc(usersCollectionRef, {name: newName, age: Number(newAge), url: url})
            }
            createUser()
            setTimeout(() => {
              document.location.reload()
            }, 1000)
          })
          
        }
        )
    
      }
  
      uploadFile(file)
      
      formRef.current.reset()
    }
    
  }


  return (
    <div className='App'>
        <form onSubmit={handleSubmit} ref={formRef}>
          <input className='input' type="text" placeholder='Name ...' onChange={(e) => setNewName(e.target.value)} />
          <input className='input' type="number" placeholder='Age' onChange={(e) => setNewAge(e.target.value)} />
          <label>
              Max-Size 1024 kb <input type="file"/>
            </label> 
          <div ref={errRef} className='err'>
            <h2>uploading file is too big</h2>
          </div>
          <button>Create User</button>
        </form>
        <h1>Upload {progress} %</h1>

        <div className='datamain'>
          {users.map(user => 
            (<div className='us' key={user.id}>
                <h1>name: {user.name}</h1>
                <h1>age: {user.age}</h1>
                <div className='img'>
                  <img src={user.url} alt="" />
                </div>
                <button onClick={() => updateUser(user.id, user.age)}>increase Age</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
            </div>))}
        </div>
    </div>
  )
}

export default App;

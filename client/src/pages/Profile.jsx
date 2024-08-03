import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'

//firebase storage rules
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if 
//       request.resource.size <2 *1024 *1024 &&
//       request.resource.contentType.matches('image/.*');
//     }
//   }
// }

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})


  useEffect(() =>{
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress))
      },
    (error)=> {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL})
      })
    }
  )
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      
      <form className='flex flex-col gap-4'>
        
        <input type="file" ref={fileRef} className="hidden" accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
        <img src={formData.avatar ||currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" onClick={() => fileRef.current.click()}></img>
        <p className='text-sm self-center'>
          {fileUploadError?(
            <span className='text-red-700'>Error Image Upload (image muse be less than 2MB)</span>
          ): filePercent === 100?(
              <span className='text-green-700'>Image Successfully Uploaded</span>
          ): filePercent >0 && filePercent < 100?(
            <span>{`Uploading ${filePercent}%`}</span>
          ):(
            ""
        )}
        </p>

        <input type="text" placeholder= "username" id='username' className= "border p-3 rounded-lg"/>
        <input type="text" placeholder= "email" id='email' className= "border p-3 rounded-lg"/>
        <input type="text" placeholder= "password" id='password' className= "border p-3 rounded-lg"/>
        
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      
      </form>
      
      <div className='flex justify-between mt-5'>
      
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>

      </div>
    </div> 
  )
}

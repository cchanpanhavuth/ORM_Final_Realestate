import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice'

import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showPropertysError, setShowPropertysError] = useState(false)
  const [userPropertys, setUserPropertys] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

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
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }

  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }

      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowPropertys = async () => {
    try {
      setShowPropertysError(false);
      const res = await fetch(`/api/user/property/${currentUser.id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowPropertysError(true);
        return;
      }
      setUserPropertys(data);
    } catch (error) {
      setShowPropertysError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input type="file" ref={fileRef} className="hidden" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <img src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" onClick={() => fileRef.current.click()}></img>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image Upload (image muse be less than 2MB)</span>
          ) : filePercent === 100 ? (
            <span className='text-green-700'>Image Successfully Uploaded</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span>{`Uploading ${filePercent}%`}</span>
          ) : (
            ""
          )}
        </p>

        <input type="text" placeholder="username" id='username' className="border p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange} />
        <input type="text" placeholder="email" id='email' className="border p-3 rounded-lg" defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder="password" id='password' className="border p-3 rounded-lg" />

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}>
          Create Listing
        </Link>

      </form>

      <div className='flex justify-between mt-5'>

        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>

      </div>

      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User updated successfully!" : ""}</p>
      <button onClick={handleShowPropertys} className='text-green-700 w-full'>
        Show Property
      </button>
      <p className='text-red-700 mt-5'>
        {showPropertysError ? 'Error showing property' : ''}
      </p>
      {userPropertys && userPropertys.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Property
          </h1>
          {userPropertys.map((property) => (
            <div
              key={property.id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/property/${property.id}`}>
                <img
                  src={property.imageUrl[0]}
                  alt='property cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/property/${property.id}`}
              >
                <p>{property.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link >
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

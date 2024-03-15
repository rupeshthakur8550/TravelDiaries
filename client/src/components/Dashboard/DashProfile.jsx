import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { updateStart, updateSuccess, updateFaillure, deleteUserStart, deleteUserSuccess, deleteUserFaillure } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function DashProfile() {
    const { currentUser, error } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updateUserError, setUpdateUserError] = useState(null);
    const filePickerRefer = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);
    const uploadImage = async () => {
        console.log('uploading image .....');
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        const isSameData = Object.keys(formData).every(key => formData[key] === currentUser[key]);
        if (isSameData) {
            setUpdateUserError("No changes made");
            return;
        }

        try {
            dispatch(updateStart());
            console.log(currentUser);
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFaillure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updates Successfully");
            }
        } catch (error) {
            dispatch(updateFaillure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            console.log(currentUser.id);
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFaillure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFaillure(error.message));
        }
    };
    return (
        <>
            <h1 className='my-7 text-center font-semibold text-3xl'>{`Welcome, ${currentUser.username}`}</h1>
            <h1 className='my-7 text-center text-xl'>Profile</h1>
            <form className='flex flex-col items-center gap-4' onSubmit={handleSubmit}>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRefer} hidden />
                <div className="w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRefer.current.click()}>
                    <img src={imageFileUrl || currentUser.profilePicture} alt='user' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
                <TextInput type='text' id='name' placeholder='name' defaultValue={currentUser.name} onChange={handleChange} className='w-[70%]' />
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} className='w-[70%]' />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} className='w-[70%]' />
                <TextInput type='password' id='password' placeholder='password' defaultValue={currentUser.password} onChange={handleChange} className='w-[70%]' />
                <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[70%]'>
                    Update
                </Button>
            </form>
            <div className='text-red-600 flex justify-center mt-4'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-500 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-700'> Are you sure, you want to delete your account ?</h3>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DashProfile
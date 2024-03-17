import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { DatePicker } from 'antd';

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
        console.log('Uploading image...');
        // Logic for uploading image to server
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
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
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
                <TextInput type='text' id='name' placeholder='Name' defaultValue={currentUser.name} onChange={handleChange} className='w-[70%]' />
                <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} className='w-[70%]' />
                <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} className='w-[70%]' />
                <DatePicker
                    placeholder={currentUser.dateOfBirth ? currentUser.dateOfBirth : 'Select your Date of Birth'}
                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date ? date.format('YYYY-MM-DD') : null })}
                    className='w-[70%] h-11'
                />

                <TextInput type='text' id='mobileNo' placeholder='Mobile No' defaultValue={currentUser.mobileNo || ''} onChange={handleChange} className='w-[70%]' />
                <TextInput type='password' id='password' placeholder='Password' defaultValue={currentUser.password} onChange={handleChange} className='w-[70%]' />
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
                        <h3 className='mb-5 text-lg text-gray-700'> Are you sure you want to delete your account?</h3>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DashProfile;

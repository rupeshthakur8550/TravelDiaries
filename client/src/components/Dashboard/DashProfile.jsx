import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { DatePicker } from 'antd';
import { TextField, Typography } from '@mui/material';
import { getDownloadURL, getStorage, uploadBytesResumable, ref, deleteObject } from 'firebase/storage';
import { app } from '../../firebase.js'

function DashProfile() {
    const { currentUser, error } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [formData, setFormData] = useState({});
    const [userEmail, setUserEmail] = useState(currentUser.email);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [showdeleteModal, setdeleteShowModal] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyValue, setVerifyValue] = useState('remove');
    const filePickerRefer = useRef();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    const handleEmailRemove = () => {
        setVerifyValue('Verify');
        setUserEmail(null);
    };

    const handleEmailVerify = (e) => {
        setVerifyValue('Verified');
        setShowVerifyModal(false);
    };

    const uploadImage = () => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            setImageUploadError('Profile is Uploading...');

            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    setImageUploadError('Could not upload image (File must be less than 2MB)');
                    setImageFile(null);
                    setImageFileUrl(null);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            setImageFileUrl(downloadURL);
                            setFormData({ ...formData, profilePicture: downloadURL });
                            setImageUploadError(null);
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            );
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        
        try {
            if (imageFile) {
                const imageUrl = await uploadImage();
                formData.profilePicture = imageUrl;
            }
            // console.log(formData.profilePicture);
            const isSameData = Object.keys(formData).every(key => formData[key] === currentUser[key]);

            if (isSameData && !imageFile) {
                setUpdateUserError("No changes made");
                return;
            }

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
                setImageUploadError(null);
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setdeleteShowModal(false);
        try {
            if (currentUser.verification === 'verified') {
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
                {
                    imageUploadError && (
                        <Alert color={imageUploadError === 'Profile Picture Uploaded' ? 'success' : 'failure'}>
                            {imageUploadError}
                        </Alert>
                    )
                }

                <TextInput type='text' id='name' placeholder='Name' defaultValue={currentUser.name} onChange={handleChange} className='w-[90%]' />
                <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} className='w-[90%]' />
                <div className='flex justify-center items-center gap-2 w-[90%]' style={{ position: 'relative' }}>
                    <TextInput
                        onChange={handleChange}
                        type='text'
                        id='email'
                        value={userEmail === null ? '' : userEmail}
                        className='w-[100%]'
                        inputprops={{
                            disableUnderline: true,
                        }}
                    />
                    <Typography
                        sx={{
                            cursor: "pointer",
                            userSelect: "none",
                            position: 'absolute',
                            top: '50%',
                            right: '15px',
                            transform: 'translateY(-50%)',
                            fontSize: '16px',
                            color: verifyValue === 'remove' ? 'blue' : (verifyValue === 'Verify' ? 'red' : 'green')
                        }}
                        onClick={() => {
                            if (verifyValue === 'Verify') {
                                setShowVerifyModal(true);
                            } else if (verifyValue === 'remove') {
                                handleEmailRemove();
                            }
                        }}
                    >
                        {verifyValue}
                    </Typography>
                </div>
                <DatePicker
                    placeholder={currentUser.dateOfBirth ? currentUser.dateOfBirth : 'Select your Date of Birth'}
                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date ? date.format('YYYY-MM-DD') : null })}
                    className='w-[90%] h-11'
                />

                <TextInput type='text' id='mobileNo' placeholder='Mobile No' defaultValue={currentUser.mobileNo || ''} onChange={handleChange} className='w-[90%]' />
                <TextInput type='password' id='password' placeholder='New Password' defaultValue={currentUser.password} onChange={handleChange} className='w-[90%]' />
                <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[90%]'>
                    Update
                </Button>
            </form >
            <div className='text-red-600 flex justify-center mt-4 mb-11'>
                <span onClick={() => setdeleteShowModal(true)} className='cursor-pointer'>Delete Account</span>
            </div>
            {
                updateUserSuccess && (
                    <Alert color='success' className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )
            }
            {
                updateUserError && (
                    <Alert color='failure' className='mt-5'>
                        {updateUserError}
                    </Alert>
                )
            }
            {
                error && (
                    <Alert color='failure' className='mt-5'>
                        {error}
                    </Alert>
                )
            }
            <Modal show={showdeleteModal} onClose={() => setdeleteShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-500 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-700'> Are you sure you want to delete your account?</h3>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setdeleteShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} popup size='sm'>
                <Modal.Header />
                <div className="text-center">
                    <h3 className='mb-5 text-lg text-gray-700'>Enter OTP below:</h3>
                    <div className='mb-10 flex justify-center items-center gap-3'>
                        <TextField
                            type='text'
                            id='otp'
                            placeholder="OTP"
                            size="small"
                        />
                        <Button
                            onClick={handleEmailVerify}
                            color='green'
                            outline="false"
                        >
                            Verify
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default DashProfile;

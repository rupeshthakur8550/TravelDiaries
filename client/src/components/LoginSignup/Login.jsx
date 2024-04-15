import { Alert, Button, Stack, TextField, Typography, colors } from '@mui/material';
import { ScreenMode } from '../pages/SignInPage';
import React, { useState } from 'react';
import { Spinner, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from './OAuth';

const Login = ({ onSwitchMode }) => {

    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector(state => state.user);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prevData => ({ ...prevData, [e.target.id]: e.target.value.trim() }));
    };    

    const handleEmailVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/getusername', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                setShowModal(false);
                dispatch(signInFailure('User not found'));
            } else {
                setShowModal(false);
                dispatch(signInSuccess('Username has been sent to your email'));
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            return dispatch(signInFailure('Please fill out all fields..'));
        }
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
            }
            if (res.ok) {
                dispatch(signInSuccess(data));
                data.profile_complete_status ? navigate('/allposts') : navigate('/dashboard?tab=profile');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className='w-70 flex-wrap-reverse'>
            <form onSubmit={handleSubmit}>
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        minHeight: "70vh",
                        color: colors.grey[800]
                    }}>
                    <Stack spacing={2} sx={{
                        width: "100%",
                        maxWidth: "500px"
                    }}>
                        <Stack>
                            <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
                                Welcome to the Journey..
                            </Typography>
                            <Typography color={colors.grey[600]}>
                                <br />
                                WE TRAVEL NOT TO ESCAPE LIFE, BUT FOR LIFE NOT TO ESCAPE US.
                            </Typography>
                        </Stack>

                        <Stack spacing={2}>
                            <Stack spacing={2}>
                                <Stack spacing={1}>
                                    <Typography color={colors.grey[800]}>Username</Typography>
                                    <TextField
                                        onChange={handleChange}
                                        placeholder="username"
                                        id='username'
                                        type='text'
                                    />
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography color={colors.grey[800]}>Password</Typography>
                                    <TextField
                                        onChange={handleChange}
                                        type='password'
                                        id='password'
                                        placeholder="********"
                                    />
                                </Stack>
                            </Stack>
                            <Button
                                type="submit"
                                variant='contained'
                                size='large'
                                sx={{
                                    bgcolor: colors.grey[800],
                                    "&:hover": {
                                        bgcolor: colors.grey[600]
                                    }
                                }}
                                disabled={loading}>
                                {
                                    loading ? (
                                        <><Spinner size="sm" /><span className='pl-3'>Loading...</span></>
                                    ) : 'Sign In'
                                }
                            </Button>
                            <OAuth />
                        </Stack>
                        <Stack direction="column" spacing={1} justifyContent="center" className='text-center'>
                            <Typography
                                onClick={() => setShowModal(true)}
                                fontWeight={600}
                                className='hover:underline'
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}>
                                Forget Username?
                            </Typography>
                            <Typography
                                onClick={() => onSwitchMode(ScreenMode.RESET_PASS)}
                                fontWeight={600}
                                className='hover:underline'
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}>
                                Forget Password?
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Typography>Don't have an account?</Typography>
                            <Typography
                                onClick={() => onSwitchMode(ScreenMode.SIGN_UP)}
                                fontWeight={600}
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}>
                                Sign Up
                            </Typography>
                        </Stack>
                        {errorMessage && (
                            <Alert className='mt-5 self-center' severity="error">
                                {errorMessage}
                            </Alert>)
                        }
                    </Stack>
                </Stack>
            </form>
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='sm'>
                <Modal.Header />
                <div className="text-center">
                    <h3 className='mb-5 text-lg text-gray-700'>Find Username</h3>
                    <div className='mb-10 flex justify-center items-center gap-3'>
                        <TextField
                            type='email'
                            id='email'
                            placeholder="Email"
                            size="small"
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            onClick={handleEmailVerify}
                            variant='contained'
                            size='small'
                            sx={{
                                bgcolor: colors.green[800],
                                "&:hover": {
                                    bgcolor: colors.blue[600]
                                }
                            }}
                        >
                            Find
                        </Button>
                    </div>
                    {errorMessage && (
                        <Alert className='mt-5 self-center' severity={errorMessage.includes('Username') ? 'success' : 'error'}>
                        {errorMessage}
                    </Alert>)
                    }
                </div>
            </Modal>
        </div>
    );
};

export default Login;
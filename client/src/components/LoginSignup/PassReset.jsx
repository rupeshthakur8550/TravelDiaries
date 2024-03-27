import React, { useState } from 'react';
import { Alert, Button, Stack, TextField, Typography, colors } from '@mui/material';
import { Spinner, Modal } from 'flowbite-react';
import { ScreenMode } from '../pages/SignInPage';

const Reset = ({ onSwitchMode }) => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@]{8,}$/;

    const handleChange = (e) => {
        if (e.target.id === 'cpassword' || e.target.id === 'npassword') {
            if (!passwordRegex.test(e.target.value)) {
                return setErrorMessage('Password must contain at least 8 characters, including one uppercase letter and one digit.');
            }
        }
        setErrorMessage(null);
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleEmailVerify = async (e) => {
        e.preventDefault();
        setLoading(false);
        try {
            const res = await fetch('/api/user/getusername', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                setShowModal(false);
                setErrorMessage('User not found');
            } else {
                setShowModal(false);
                setErrorMessage('Username has been sent to your email');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.cpassword || !formData.npassword) {
            return setErrorMessage('Please fill out all fields.');
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            if (verifyValue === 'verified') {
                const res = await fetch('/api/auth/forgetpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok || data.success === false) {
                    setLoading(false);
                    return setErrorMessage(data.message || 'An error occurred. Please try again.');
                }
                onSwitchMode(ScreenMode.SIGN_IN);
            }
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred. Please try again.');
        }
        setLoading(false);
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
                                Password Reset
                            </Typography>
                        </Stack>
                        <Stack spacing={2}>
                            <Stack spacing={1}>
                                <div className='flex justify-center items-center gap-2' style={{ position: 'relative' }}>
                                    <TextField
                                        onChange={handleChange}
                                        type='text'
                                        id='username'
                                        placeholder="Username"
                                        className='w-[100%]'
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                </div>
                            </Stack>
                            <Stack spacing={1}>
                                <Typography color={colors.grey[800]}>Current Password</Typography>
                                <TextField
                                    name="cpassword"
                                    onChange={handleChange}
                                    type="password"
                                    id='cpassword'
                                    placeholder="********"
                                />
                            </Stack>
                            <Stack spacing={1}>
                                <Typography color={colors.grey[800]}>New Password</Typography>
                                <TextField
                                    name="npassword"
                                    onChange={handleChange}
                                    type="password"
                                    id='npassword'
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
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" /> : 'Reset Password'}
                        </Button>
                        <Stack direction="row" spacing={2} justifyContent="center">
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
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Typography>Remember..?</Typography>
                            <Typography
                                onClick={() => onSwitchMode(ScreenMode.SIGN_IN)}
                                fontWeight={600}
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}>
                                Log In
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

export default Reset;

import React, { useState } from 'react';
import { Alert, Button, Stack, TextField, Typography, colors } from '@mui/material';
import { Spinner, Modal } from 'flowbite-react';
import { ScreenMode } from '../pages/SignInPage';

const Reset = ({ onSwitchMode }) => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verifyValue, setVerifyValue] = useState('Verify');
    const [showModal, setShowModal] = useState(false);
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@]{8,}$/;

    const handleSendEmail = async (e, path) => {
        e.preventDefault();
        setVerifyValue('Resend');
        setLoading(false);
        setErrorMessage(null);
        setShowModal(true);
        try {
            const res = await fetch(`/api/otp/mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, type: path }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMessage(data.message);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleEmailVerify = async (e, isClick) => {
        e.preventDefault();
        setLoading(false);
        try {
            const otpInputValue = document.getElementById('otp').value;
            if (otpInputValue.length === 6 && isClick) {
                setErrorMessage(null);
                const verifyRes = await fetch('/api/otp/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, otp: otpInputValue }),
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) {
                    setErrorMessage(verifyData.message);
                } else {
                    setVerifyValue('verified');
                    setShowModal(false);
                    setErrorMessage(null);
                }
            } else {
                setErrorMessage('OTP must be 6 characters long.');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleChange = (e) => {
        if (e.target.id === 'cpassword' || e.target.id === 'npassword') {
            if (!e.target.value || !passwordRegex.test(e.target.value)) {
                return setErrorMessage('Password must contain at least 8 characters, including one uppercase letter and one digit.');
            }
        }
        setErrorMessage(null);
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.cpassword || !formData.npassword) {
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
                if (data.success === false) {
                    setLoading(false);
                    return setErrorMessage(data.message || 'An error occurred. Please try again.');
                } if (res.ok) {
                    onSwitchMode(ScreenMode.SIGN_IN);
                }
            } else {
                return setErrorMessage('Please verify email..')
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
                                        id='email'
                                        placeholder="Email"
                                        className='w-[100%]'
                                    />
                                    <Typography
                                        sx={{
                                            cursor: "pointer",
                                            userSelect: "none",
                                            position: 'absolute',
                                            top: '50%',
                                            right: '10px',
                                            transform: 'translateY(-50%)',
                                            fontSize: '16px',
                                            color: verifyValue === 'Verify' ? "red" : (verifyValue === 'resend' ? "blue" : "green")
                                        }}
                                        onClick={(e) => verifyValue === 'Verify' ? handleSendEmail(e, 'send') : handleSendEmail(e, 'resend')}
                                    >
                                        {verifyValue}
                                    </Typography>
                                </div>
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
                            <Stack spacing={1}>
                                <Typography color={colors.grey[800]}>Confirm Password</Typography>
                                <TextField
                                    name="cpassword"
                                    onChange={handleChange}
                                    type="password"
                                    id='cpassword'
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
                    <h3 className='mb-5 text-lg text-gray-700'>Enter OTP below:</h3>
                    <div className='mb-10 flex justify-center items-center gap-3'>
                        <TextField
                            type='text'
                            id='otp'
                            placeholder="OTP"
                            size="small"
                            onChange={handleEmailVerify}
                        />
                        <Button
                            type="submit"
                            onClick={(e) => handleEmailVerify(e, true)}
                            variant='contained'
                            size='small'
                            sx={{
                                bgcolor: colors.green[800],
                                "&:hover": {
                                    bgcolor: colors.blue[600]
                                }
                            }}
                        >
                            Verify
                        </Button>
                    </div>
                    {errorMessage && (
                        <Alert className='mt-5 self-center' severity="error">
                            {errorMessage}
                        </Alert>)
                    }
                </div>
            </Modal>
        </div>
    );
};

export default Reset;

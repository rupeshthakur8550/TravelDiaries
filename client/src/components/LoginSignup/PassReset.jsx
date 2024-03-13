import { Button, Stack, TextField, Typography, colors } from '@mui/material';
import { ScreenMode } from '../pages/SignInPage';
import React, { useState } from 'react'
// import axios from "axios";
// import { LoginAction } from '../../store';
// import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"

const Reset = ({ onSwitchMode }) => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [cpassword, setPassword] = useState('');
    const [npassword, setNewPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    // const sendRequest = async () => {
    //     console.log(email+" "+cpassword+" "+npassword);
    //     const res = await axios.post('http://localhost:5000/api/user/forget-password', {
    //         email: email,
    //         cpassword: cpassword,
    //         npassword: npassword
    //     }).catch((err) => console.log(err));
    //     const data = await res.data;
    //     console.log(data);
    //     return data;
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
    
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@]{8,}$/;
        if (!passwordRegex.test(npassword)) {
            alert(
                'Password must contain at least 8 characters, including an uppercase letter and a number. Special characters other than @ are not allowed.'
            );
            return;
        }
    
        sendRequest()
            .then((data) => {
                // Check if password reset was successful
                if (data && data.message === 'Password reset successful') {
                    alert('Password reset successful! Please login with your new password.');
                    onSwitchMode(ScreenMode.SIGN_IN); 
                } else {
                    alert('Password reset failed. Please try again.');
                }
            })
            .catch((error) => console.error('Error during password reset:', error));
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
                            <Stack spacing={2}>
                                <Stack spacing={1}>
                                    <Typography color={colors.grey[800]}>Email</Typography>
                                    <TextField
                                        name="email"
                                        onChange={handleEmailChange}
                                        value={email}
                                        type={'email'}
                                        placeholder="email"
                                    />
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography color={colors.grey[800]}>Current Password</Typography>
                                    <TextField
                                        name="password"
                                        onChange={handlePasswordChange}
                                        value={cpassword}
                                        type={'password'}
                                        placeholder="password"
                                    />
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography color={colors.grey[800]}>New Password</Typography>
                                    <TextField
                                        name="password"
                                        onChange={handleNewPassword}
                                        value={npassword}
                                        type={'password'}
                                        placeholder="new password"
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
                            >
                                Reset Password
                            </Button>
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
                    </Stack>
                </Stack>
            </form>
        </div>
    );
};

export default Reset;
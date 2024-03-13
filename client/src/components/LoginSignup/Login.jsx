import { Alert, Button, Stack, TextField, Typography, colors } from '@mui/material';
import { ScreenMode } from '../pages/SignInPage';
import React, { useState } from 'react';
import { Spinner } from 'flowbite-react';
import { useNavigate} from 'react-router-dom';
import {signInFailure, signInStart, signInSuccess} from '../../redux/user/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import OAuth from './OAuth';

const Login = ({ onSwitchMode }) => {

    const [formData, setFormData] = useState({});
    const {loading, errorMessage} = useSelector(state => state.user);
    const dispath = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            return dispath(signInFailure('Please fill out all fields..'));
        }
        try {
            dispath(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispath(signInFailure(data.message));
            }
            if (res.ok) {
                dispath(signInSuccess(data));
                navigate('/allposts');
            }
        } catch (error) {
           dispath(signInFailure(error.message));
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
                            <OAuth/>
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="center">
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
        </div>
    );
};

export default Login;
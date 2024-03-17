import { Alert, Button, Stack, TextField, Typography, colors } from '@mui/material';
import { ScreenMode } from '../pages/SignInPage';
import React, { useState } from 'react'
import { Spinner, Modal } from 'flowbite-react'
import OAuth from './OAuth';

const Signup = ({ onSwitchMode }) => {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyValue, setVerifyValue] = useState('verify');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      console.log(formData.name);
      return setErrorMessage('Please fill out all fields..');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false)
      if (res.ok) {
        onSwitchMode(ScreenMode.SIGN_IN)
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false)
    }
  };

  return (
    <div className='w-70 flex-wrap'>
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
                Start new Journey..
              </Typography>
              <Typography color={colors.grey[600]}>
                <br />
                Start your new Journey with us .....
              </Typography>
            </Stack>

            <Stack spacing={4}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography color={colors.grey[800]}>Full Name</Typography>
                  <TextField
                    onChange={handleChange}
                    placeholder="fullname"
                    id='name'
                    type='text'
                  />
                </Stack>
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
                  <Typography color={colors.grey[800]}>Email</Typography>
                  <div className='flex justify-center items-center gap-2'>
                    <TextField
                      onChange={handleChange}
                      type='text'
                      id='email'
                      placeholder="email"
                      className='w-[90%]'
                    />
                    <Typography
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        color: verifyValue === 'verify' ? "red" : 'green'
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      {verifyValue}
                    </Typography>

                  </div>
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
                  ) : 'Sign Up'
                }
              </Button>
            </Stack>
            <OAuth />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography>Already have an account?</Typography>
              <Typography
                onClick={() => onSwitchMode(ScreenMode.SIGN_IN)}
                fontWeight={600}
                sx={{
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Sign In
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
            />
            <Button
              type="submit"
              variant='contained'
              size='small' 
              sx={{
                bgcolor: colors.green[800],
                "&:hover": {
                  bgcolor: colors.blue[600]
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className='pl-3'>Verifying...</span>
                </>
              ) : 'Verify'}
            </Button>
          </div>
        </div>
      </Modal>


    </div >
  );
};

export default Signup;
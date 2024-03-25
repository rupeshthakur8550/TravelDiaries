import { Box, Grid, colors } from '@mui/material';
import React, { useState } from 'react';
import assets from '../../assets/assets';
import SigninForm from '../LoginSignup/Login';
import SignupForm from '../LoginSignup/Signup';
import ResetpassForm from '../LoginSignup/PassReset';

export const ScreenMode = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  RESET_PASS: 'RESET_PASS'
};

const SignInPage = () => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState('unset');
  const [width, setWidth] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(assets.images.signinBg);
  const [currMode, setCurrMode] = useState(ScreenMode.SIGN_IN);

  const onSwitchMode = (mode) => {
    setWidth(100);

    const timeout1 = setTimeout(() => {
      setCurrMode(mode);
      setBackgroundImage(mode === ScreenMode.SIGN_IN ? assets.images.signinBg : assets.images.signupBg);
    }, 1100);

    const timeout2 = setTimeout(() => {
      setLeft('unset');
      setRight(0);
      setWidth(0);
    }, 1200);

    const timeout3 = setTimeout(() => {
      setRight('unset');
      setLeft(0);
    }, 2500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };
  return (
    <Grid container className='p-[2vh] md:p-[6vh] flex justify-center items-center'>
      <Grid item xs={12} md={6} lg={4} className='relative pr-[1vw] pl-[1vw] px-5 py-5'>
        {currMode === ScreenMode.SIGN_IN ? (
          <SigninForm onSwitchMode={onSwitchMode} />
        ) : (currMode === ScreenMode.SIGN_UP ? (
          <SignupForm onSwitchMode={onSwitchMode} />
        ) : <ResetpassForm onSwitchMode={onSwitchMode} />)}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: left,
            right: right,
            width: `${width}%`,
            height: '100%',
            bgcolor: colors.grey[800],
            transition: 'all 1s ease-in-out',
            zIndex: 0,
          }}
        />
      </Grid>
      <Grid
        item
        xs={8}
        className='relative hidden lg:block'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          flex: '1 0 100%',
          height: '100%',
          paddingBottom: '32.25%'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: left,
            right: right,
            width: `${width}%`,
            height: '100%',
            bgcolor: colors.grey[800],
            transition: 'all 1s ease-in-out',
            zIndex: 0,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SignInPage;

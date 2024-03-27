import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../../firebase';
import { useDispatch } from 'react-redux'
import { signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'

function OAuth() {
  const auth = getAuth(app);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispath(signInFailure(data.message));
      }
      if (res.ok) {
        dispath(signInSuccess(data));
        data.profile_complete_status ? navigate('/allposts') : navigate('/dashboard?tab=profile');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  )
}

export default OAuth
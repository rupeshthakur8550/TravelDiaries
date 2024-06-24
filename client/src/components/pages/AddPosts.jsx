import { useEffect, useState } from 'react';
import { Alert, Button, FileInput, Dropdown, TextInput, Label, Textarea } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../../redux/chat/chatSlice.js';

const AddPosts = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [addPostError, setAddPostError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedLevel, setSelectedLevel] = useState('Select Difficulty Level');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    if (location.pathname !== '/messages') {
      dispatch(setSelectedChat(null));
    }
  }, [location.pathname, dispatch]);

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setImageUploadProgress(0);
      setImageUploadError('Image is uploading...');

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress);
        },
        (error) => {
          setImageUploadError('Could not upload image (File must be less than 2MB)');
          setFile(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prevData) => ({ ...prevData, imageUrl: downloadURL }));
            setImageUploadError('Image uploaded successfully');
            setImageUploadProgress(null);
            resolve(downloadURL);
          }).catch((error) => {
            reject(error);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const isFormDataComplete = Object.values(formData).every(value => {
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (Array.isArray(value)) {
          return value.length > 0 && value.every(item => item.trim() !== '');
        }
        return false; // or handle other types as needed
      });

      if (!isFormDataComplete) {
        setAddPostError("Please fill in all the fields.");
        return;
      }
      if (file) {
        const imageUrl = await uploadImage();
        if (imageUrl.trim() !== '') {
          const updatedFormData = { ...formData, imageUrl };
          const res = await fetch('/api/post/addpost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
          });

          const data = await res.json();
          if (!res.ok) {
            setAddPostError(data.message);
            return;
          }

          setAddPostError(null);
          navigate('/allposts');
        } else {
          setAddPostError("Image URL is empty.");
        }
      } else {
        setAddPostError("Image not uploaded");
      }
    } catch (error) {
      setAddPostError('Something went wrong');
    }
  };

  const categories = [
    'Adventure',
    'Beach',
    'City Tours',
    'Cultural',
    'Family',
    'Hiking',
    'Luxury',
    'Nature',
    'Road Trips',
    'Solo Travel',
    'Wildlife',
  ];

  const levels = [
    'Novice',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  const handleDropdownItemClick = (category) => {
    setSelectedCategory(category);
    setFormData((prevData) => ({ ...prevData, category: category }));
  };

  const handleDropdownLevelItemClick = (level) => {
    setSelectedLevel(level);
    setFormData((prevData) => ({ ...prevData, difficultyLevel: level }));
  };

  const handleArrayChange = (e, key) => {
    const value = e.target.value;
    const array = value.split(', ').map(item => item.trim());
    setFormData((prevData) => ({ ...prevData, [key]: array }));
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen my-16'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Share Memory</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <Label>Title</Label>
        <div className='flex gap-4 flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Dropdown
            label={selectedCategory}
            inline
            arrowIcon={false}
          >
            {categories.map((category, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleDropdownItemClick(category)}
              >
                {category}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-violet-700 border-dashed p-2'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <Label>Description</Label>
        <ReactQuill
          theme='snow'
          placeholder='Write Brief Description Here...'
          className='h-72 mb-[4.5rem] sm:mb-12'
          required
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <Label>How To Reach</Label>
        <Textarea
          type='text'
          id='howToReach'
          placeholder='How To Reach'
          onChange={(e) => setFormData({ ...formData, howToReach: e.target.value })}
          className='flex-1'
        />
        <Label>Where To Stay</Label>
        <TextInput
          type='text'
          placeholder='Where To Stay'
          required
          id='whereToStay'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, whereToStay: e.target.value })}
        />
        <Label>Safety Tips</Label>
        <Textarea
          type='text'
          id='safetyTips'
          placeholder='Safety Tips (comma separated)'
          onChange={(e) => handleArrayChange(e, 'safetyTips')}
          className='flex-1'
        />
        <Label>What to Wear</Label>
        <Textarea
          type='text'
          id='whatToWear'
          placeholder='What to Wear'
          onChange={(e) => setFormData({ ...formData, whatToWear: e.target.value })}
          className='flex-1'
        />
        <Label>Accessories Needed</Label>
        <Textarea
          type='text'
          id='accessoriesNeeded'
          placeholder='Accessories Needed (comma separated)'
          onChange={(e) => handleArrayChange(e, 'accessoriesNeeded')}
          className='flex-1'
        />
        <Label>Location</Label>
        <TextInput
          type='text'
          placeholder='Location'
          required
          id='location'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <Label>Duration to Reach Out</Label>
        <TextInput
          type='text'
          placeholder='Duration'
          required
          id='duration'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        />
        <Label>Best Time to Visit</Label>
        <TextInput
          type='text'
          placeholder='Best Time to Visit'
          required
          id='bestTimeToVisit'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
        />
        <Label>Difficulty Level</Label>
        <Dropdown
          label={selectedLevel}
          inline
          arrowIcon={false}
        >
          {levels.map((level, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleDropdownLevelItemClick(level)}
            >
              {level}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Button type='submit' gradientDuoTone='purpleToPink' className='mt-5'>
          Add Post
        </Button>
        {addPostError && (
          <Alert className='mt-5' color='failure'>
            {addPostError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default AddPosts;

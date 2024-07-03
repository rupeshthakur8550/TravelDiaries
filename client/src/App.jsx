import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home, Posts, MyProfile, AddPosts, SignInPage, Header, ChatPage } from '../src/components/PageRoutes';
import './App.css';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/pages/PrivateRoute';
import BriefInfoPost from './components/pages/BriefInfoPost';
import ViewUser from './components/pages/ViewUser';
import UpdatePosts from './components/pages/UpdatePosts';

function App() {
  return (
    <>
      <BrowserRouter>
        <header><Header /></header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/addposts" element={<AddPosts />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/allposts" element={<Posts />} />
            <Route path="/briefinfopost" element={<BriefInfoPost />} />
            <Route path="/editpost" element={<UpdatePosts />} />
            <Route path="/viewuser" element={<ViewUser />} />
          </Route>
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

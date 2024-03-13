import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Posts, MyPosts, AddPosts, SignInPage, Header, About } from '../src/components/PageRoutes'
import './App.css'
import Dashboard from './components/pages/Dashboard'
import PrivateRoute from './components/pages/PrivateRoute'
import Footer from './components/footer/Footer'

function App() {

  return (
    <>
      <BrowserRouter>
        <header><Header/></header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/allposts" element={<Posts />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/addposts" element={<AddPosts />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
        <footer><Footer/></footer>
      </BrowserRouter>
    </>
  )
}

export default App

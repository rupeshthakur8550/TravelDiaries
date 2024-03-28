import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import StickyFooter from '../footer/StickyFooter';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? 
  <div>
    <Outlet />
    <StickyFooter />
  </div> : <Navigate to='/signin' />;
}

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ?
    <div>
      <Outlet />
    </div> : <Navigate to='/signin' />;
}

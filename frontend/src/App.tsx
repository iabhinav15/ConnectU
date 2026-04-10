import React from 'react';
import { Outlet, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { EmailVerification, EnternewPassword, GoogleRedirect, Home, Login, NotFound, Profile, Register, ResetPassword } from './pages';
import { useAppSelector } from './redux/hooks';

function Layout() {
  const { user } = useAppSelector(state => state.user);
  const location = useLocation();

  return user?.token ? (<Outlet/>) : (
    <Navigate to='/login' state={{ from: location }} replace/>
  )
}

function App() {
  const { theme } = useAppSelector(state => state.theme);
  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Home />}></Route>
          <Route path='/profile/:id?' element={<Profile />}></Route>
        </Route>

        <Route path='/register' element={<Register />}/>
        <Route path='/users/verify/:userId/:token' element={<EmailVerification/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path='/reset-password/:userId/:token' element={<EnternewPassword/>}/>
        <Route path='/auth/register/google' element={<GoogleRedirect/>}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </div>
  );
}

export default App;

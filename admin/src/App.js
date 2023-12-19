import React from "react";
import Auth from "./Components/Auth";
import ManageJobs from "./Components/admin/ManageJobs";
import AdminProfile from "./Components/admin/AdminProfile";
import AdminDashBord from './Components/admin/AdminDashBord'
import Theme from './Components/system/Theme'
import Help from "./Components/system/Help";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Verify from "./Components/Verify";
import './App.css'
import Pc from './img/pc.png'

const App = () => {

  return (
    <Router>
      <>
        <div className="usePc">
          <img src={Pc} alt="" />
          <p>Use Pc for Best Experience</p>
        </div>
        <div className="appCont">
          <Routes>
            <Route path='/' element={localStorage.getItem('adminInfo') ? <Navigate to='/admin/dashbord' /> : <Auth />} />
            <Route path='/verify' element={localStorage.getItem('adminInfo') ? <Navigate to='/admin/dashbord' /> : <Verify />} />
            <Route path='/admin/userverify' element={localStorage.getItem('adminInfo') ? <ManageJobs /> : <Navigate to='/' />} />
            <Route path='/admin/dashbord' element={localStorage.getItem('adminInfo') ? <AdminDashBord /> : <Navigate to='/' />} />
            <Route path='/admin/useradmin' element={localStorage.getItem('adminInfo') ? <AdminProfile /> : <Navigate to='/' />} />
            <Route path='system/theam' element={localStorage.getItem('adminInfo') ? <Theme /> : <Navigate to='/' />} />
            <Route path='system/help' element={localStorage.getItem('adminInfo') ? <Help /> : <Navigate to='/' />} />
          </Routes>
        </div>
      </>
    </Router>

  )
}

export default App
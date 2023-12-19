import React, { useEffect } from 'react'
import logo from '../../img/logo.png'
import '../CSS/admin/DashBord.css'
import menus from '../../img/Icons/menus.svg'
import userManagement from '../../img/Icons/userManagement.svg'
import admin from '../../img/Icons/admin.svg'
import theme from '../../img/Icons/theme.svg'
import help from '../../img/Icons/help.svg'
import gearFill from '../../img/Icons/gearFill.svg'
import activeDashBord from '../../img/Icons/activeDashbord.svg'
import activeUserManage from '../../img/Icons/activeUserManage.svg'
import activeAdmin from '../../img/Icons/activeAdmins.svg'
import { Link, useLocation } from 'react-router-dom'
import powerBtn from '../../img/powerBtn.png'

const DashBord = () => {
    let location = useLocation();
    useEffect(() => { }, [location]);
    const funcLogout = () => {
        localStorage.removeItem('adminInfo')
        localStorage.removeItem('email')
        localStorage.removeItem('adminType')
        window.location.reload()
    }
    return (
        <div className='dashBordCont'>
            <div className="logoCont">
                <img src={logo} alt="logo" />
                <hr />
            </div>
            <div className='LogoLowerCont'>
                <div className="allIconWrapper">
                    <Link to='/admin/dashbord'>
                        <div className={`iconCont ${location.pathname === '/admin/dashbord' ? 'active' : ''}`}>
                            <img src={location.pathname === '/admin/dashbord' ? activeDashBord : menus} alt="menus" />
                            <p>Dashbord</p>
                        </div>
                    </Link>
                    {(localStorage.getItem('adminType') === 'userAdmin' || localStorage.getItem('adminType') === 'superAdmin') &&
                        <Link to='/admin/userverify'>
                            <div className={`iconCont ${location.pathname === '/admin/userverify' ? 'active' : ''}`}>
                                <img src={location.pathname === '/admin/userverify' ? activeUserManage : userManagement} alt="userManagement" />
                                <p>Manage Jobs</p>
                            </div>
                        </Link>
                    }
                    {localStorage.getItem('adminType') === 'superAdmin' &&
                        <Link to='/admin/useradmin'>
                            <div className={`iconCont ${location.pathname === '/admin/useradmin' ? 'active' : ''}`}>
                                <img src={location.pathname === '/admin/useradmin' ? activeAdmin : admin} alt="Admin" />
                                <p>Profile</p>
                            </div>
                        </Link>
                    }
                    <Link to='/system/theam'>
                        <div className='iconCont'>
                            <img src={theme} alt="theme" />
                            <p>System Theme</p>
                        </div>
                    </Link>
                    <Link to='/system/help'>
                        <div className='iconCont'>
                            <img src={help} alt="Help" />
                            <p>Help?</p>
                        </div>
                    </Link>
                </div>
                <div className='adminInfoCont'>
                    <hr />
                    <div className='adminInfoWrapper'>
                        <div>
                            <div className='adminEmailCont'>
                                <img src={gearFill} alt="gearFill" />
                                <h4>{localStorage.getItem('email')}</h4>
                            </div>
                            <p>Logged in as <span>{localStorage.getItem('adminInfo') === null ? "" : JSON.parse(localStorage.getItem('adminInfo')).adminName === undefined ? "Super Admin" : JSON.parse(localStorage.getItem('adminInfo')).adminName}</span></p>
                        </div>
                    </div>
                    <div className="logoutBtnCont">
                        <img src={powerBtn} alt="PowerOff" onClick={funcLogout}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBord

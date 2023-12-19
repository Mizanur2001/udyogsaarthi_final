import React, { useState } from 'react'
import './CSS/Auth.css'
import logo from '../img/logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import hidePassImg from '../img/Icons/showPass.svg'
import showPassImg from '../img/Icons/hidePass.svg'

const Auth = () => {

    const URL = process.env.REACT_APP_BACKEND_URL
    const nevigate = useNavigate()
    const [selectedAdmin, setSelectedAdmin] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [inputVal, setInputVal] = useState({
        email: "",
        password: ""
    })

    const funcSelectAdmin = (admin) => {
        setSelectedAdmin(admin)
    }

    const handleChanhe = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcLogin = () => {
        let extraUrl
        if (selectedAdmin === 'superAdmin') {
            extraUrl = '/superadmin/login'
        }
        else if (selectedAdmin === 'dataEntryOpt') {
            extraUrl = '/admin/dataentryopt/login'
        }
        else if (selectedAdmin === 'userAdmin') {
            extraUrl = '/admin/useradmin/login'
        }
        else {
            toast.error("Select Admin type")
            return;
        }

        const Data = {
            email: inputVal.email,
            password: inputVal.password
        }

        axios.post(`${URL}${extraUrl}`, Data).then((response) => {
            toast.success(response.data)
            localStorage.setItem('email', inputVal.email)
            localStorage.setItem('adminType', selectedAdmin)
            setTimeout(() => {
                nevigate('/verify')
            }, 3000)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    return (
        <div className='Container'>
            <ToastContainer />

            {/*Login*/}

            <div className='signinContainer'>
                <div className='signinWrapper'>
                    <div className='loginText'>
                        <h2>Admin Login Panel</h2>
                    </div>
                    <form>
                        <div className="selectRoleCont">
                            <p className='selectRoleHead'>Select Role</p>
                            <div className="selectRole">
                                <div className={`${selectedAdmin === 'superAdmin' ? 'active' : ""} superAdmin admins`} onClick={() => funcSelectAdmin('superAdmin')}>
                                    <p>Super Admin</p>
                                </div>
                                <div className={`${selectedAdmin === 'dataEntryOpt' ? 'active' : ""} dataEntryOpt admins`} onClick={() => funcSelectAdmin('dataEntryOpt')}>
                                    <p>Data Admin</p>
                                </div>
                                <div className={`${selectedAdmin === 'userAdmin' ? 'active' : ""} userAdmin admins`} onClick={() => funcSelectAdmin('userAdmin')}>
                                    <p>User Admin</p>
                                </div>
                            </div>
                        </div>
                        <div className='inutWrapper'>
                            <label htmlFor="email">Email Id</label>
                            <input type="email" name='email' value={inputVal.email} onChange={handleChanhe} />
                        </div>
                        <div className='inutWrapper'>
                            <label htmlFor="password">Password</label>
                            <input type={showPass ? "text" : "password"} name='password' value={inputVal.password} onChange={handleChanhe} />
                            <img src={showPass ? hidePassImg : showPassImg} alt="showPass" className='showPass' onClick={() => { setShowPass(!showPass) }} />
                        </div>
                    </form>
                    <div className='forgotPassCont'>
                        <div className='checkBoxCont'>
                            <input type="checkbox" name="rmeberme" />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                    </div>
                    <div className='signinBtnCont'>
                        <button onClick={funcLogin}>Sign In</button>
                    </div>
                </div>
                <div className='logo'>
                    <div></div>
                    <img src={logo} alt="logo" />
                    <div></div>
                </div>
            </div>
        </div >

    )
}

export default Auth

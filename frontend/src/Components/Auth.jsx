import React, { useState } from 'react'
import './CSS/Auth.css'
import logo from '../img/logo.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import showPassImg from '.././img/Icons/showPass.svg'
import hidePassImg from '.././img/Icons/hidePass.svg'

const Auth = () => {
    const nevigate = useNavigate()
    const URL = process.env.REACT_APP_BACKEND_URL
    const [activeLogin, setActiveLogin] = useState(true)
    const [inputVal, setInputVal] = useState({ name: "", email: "", phone: "", year: "", password: "", cpassword: "" })
    const [inputValLogin, setInputvalLogin] = useState({ email: "", password: "" })
    const [btnDisable, setBtnDisable] = useState(true)
    const [showPass, setShowPass] = useState(false)

    const handleOnChanche = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSignUp = (e) => {
        e.preventDefault()
        axios.post(`${URL}/signup`, inputVal).then((response) => {
            if (response.data === 'Data Saved Sucessfully') {
                nevigate('/pending')
            }
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const handleOnChanheLogin = (e) => {
        setInputvalLogin({ ...inputValLogin, [e.target.name]: e.target.value })
    }

    const funcLogin = () => {
        axios.post(`${URL}/login`, inputValLogin).then((response) => {
            const Data = response.data
            if (Data === 'not approved') {
                nevigate('/pending')
            } else {
                localStorage.setItem('userInfo', response.data)
                nevigate('/search')
                window.location.reload()
            }
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    return (
        <div className='Container'>
            <ToastContainer />
            <div className="mainLogo">
                <img src={logo} alt="" />
            </div>
            {/*Sign Up */}
            {!activeLogin && <div className='signupContainer'>

                <div className='signupWrapper'>
                    <form>
                        <div className='heading'>
                            <h1>Create your account</h1>
                            <div>
                                <span>Or</span>
                                <p onClick={() => { setActiveLogin(true) }}>Already have an account?</p>
                            </div>
                        </div>
                        <div className='flex mt-10'>
                            <label htmlFor="name">Name</label>
                            <input type="text" name='name' onChange={handleOnChanche} value={inputVal.name} />
                        </div>
                        <div className='flex mt-10'>
                            <label htmlFor="email">Email Id</label>
                            <input type="email" name='email' onChange={handleOnChanche} value={inputVal.email} />
                        </div>
                        <div className='flex mt-10'>
                            <label htmlFor="phone">Phone</label>
                            <input type="number" name='phone' onChange={handleOnChanche} value={inputVal.phone} />
                        </div>
                        <div className='flex mt-10'>
                            <label htmlFor="YearOfBirth">Year Of Birth</label>
                            <input type="number" name='year' onChange={handleOnChanche} value={inputVal.year} />
                        </div>
                        <div className='flex mt-10'>
                            <label htmlFor="password">Password</label>
                            <input type={showPass ? "text" : "password"} name='password' onChange={handleOnChanche} value={inputVal.password} />
                            <img src={showPass ? showPassImg : hidePassImg} alt="showPass" className='showPass' onClick={() => { setShowPass(!showPass) }} />
                        </div>
                        <div className='flex'>
                            <label htmlFor="cpassword">Confirm Password</label>
                            <input type="password" name='cpassword' onChange={handleOnChanche} value={inputVal.cpassword} />
                        </div>
                        <div className='privacyPolicy'>
                            <input type="checkbox" onClick={() => { setBtnDisable(!btnDisable) }} />
                            <div className='chechboxText'>
                                <p>Agree to our </p>
                                <a href="/">privacy policy</a>
                            </div>
                        </div>
                        <div className='signupBtnCont'>
                            <button className={btnDisable ? 'disable' : ""} onClick={funcSignUp} disabled={btnDisable}>Sign Up</button>
                        </div>
                    </form>
                </div>
                <div className="logo">
                    <div></div>
                    <img src={logo} alt="logo" />
                    <div></div>
                </div>
            </div>}

            {/*Login*/}
            {
                activeLogin && <div className='signinContainer'>
                    <div className='signinWrapper'>
                        <div className='loginText'>
                            <h2>User Login</h2>
                            {/* <div className='signupMsgWrapper'>
                                <span>Or </span><p onClick={() => { setActiveLogin(false) }}> Ceate a new account</p>
                            </div> */}
                        </div>
                        <form>
                            <div className='inutWrapper'>
                                <label htmlFor="email">Email Id</label>
                                <input type="email" name='email' onChange={handleOnChanheLogin} value={inputValLogin.email} />
                            </div>
                            <div className='inutWrapper'>
                                <label htmlFor="password">Password</label>
                                <input type={showPass ? "text" : "password"} name='password' onChange={handleOnChanheLogin} value={inputValLogin.password} />
                                <img src={showPass ? showPassImg : hidePassImg} alt="showPass" className='showPass' onClick={() => { setShowPass(!showPass) }} />
                            </div>
                        </form>
                        <div className='forgotPassCont'>
                            <div className='checkBoxCont'>
                                <input type="checkbox" name="rmeberme" />
                                <label htmlFor="rememberMe">Remember me</label>
                            </div>
                            <p onClick={() => {nevigate('/forgotPass')}}>Forgot Password?</p>
                        </div>
                        <div className='signinBtnCont'>
                            <button onClick={funcLogin}>Login</button>
                        </div>
                        <div className='orContinueWithCont'>
                            <div></div>
                            <p>Or continue with</p>
                            <div></div>
                        </div>
                        <div className='logingWiothOtpBtn'>
                            <button onClick={() => { setActiveLogin(false) }}>Ceate a new account</button>
                        </div>
                    </div>
                    <div className='logo'>
                        <div></div>
                        <img src={logo} alt="logo" />
                        <div></div>
                    </div>
                </div>
            }
        </div >

    )
}

export default Auth

import React, { useState } from 'react'
import logo from '../img/logo.png'
import './CSS/ForgotPass.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPass = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const Navigate = useNavigate()
    const [inputVal, setInputVal] = useState({ email: "", otp: "", password: "", cpassword: "" })
    const [funcEamilCall, setFuncEmailCall] = useState(true)
    const [funcOtpCall, setFuncOtpCall] = useState(false)
    const [funcSetPassCall, setFuncSetPassCall] = useState(false)

    const handleOnChanche = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcEmail = () => {

        axios.post(`${URL}/user/forgetpass/email`, { email: inputVal.email }).then((response) => {
            localStorage.setItem('userEmailId', inputVal.email)
            setFuncEmailCall(false);
            setFuncOtpCall(true)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const funcOtp = () => {

        const Data = {
            email: localStorage.getItem('userEmailId'),
            otp: inputVal.otp
        }

        axios.post(`${URL}/user/forgetpass/otp`, Data).then((response) => {
            setFuncOtpCall(false)
            setFuncSetPassCall(true)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const funcResetPass = () => {

        const Data = {
            email: localStorage.getItem('userEmailId'),
            password: inputVal.password,
            cpassword: inputVal.cpassword
        }

        axios.post(`${URL}/user/forgetpass/password`, Data).then(() => {
            Navigate('/')
        }).catch(err => {
            toast.error(err.response.data)
        })
    }


    return (
        <div className='forgotPassCont'>
            <div className='signinWrapper'>
                <ToastContainer />
                <div className='loginText'>
                    <h2>Forgot Password</h2>
                    {/* <div className='signupMsgWrapper'>
                                <span>Or </span><p onClick={() => { setActiveLogin(false) }}> Ceate a new account</p>
                            </div> */}
                </div>
                <form>
                    {funcEamilCall &&
                        <div className='inutWrapper'>
                            <label htmlFor="email">Email Id</label>
                            <input type="email" name='email' onChange={handleOnChanche} value={inputVal.email} />
                        </div>
                    }
                    {funcOtpCall &&
                        <div className='inutWrapper'>
                            <label htmlFor="otp">OTP</label>
                            <input type="number" name='otp' onChange={handleOnChanche} value={inputVal.otp} />
                        </div>
                    }
                    {funcSetPassCall &&
                        <div className='inutWrapper'>
                            <label htmlFor="email">Password</label>
                            <input type="password" name='password' onChange={handleOnChanche} value={inputVal.password} />
                            <label htmlFor="email">Confirm Password</label>
                            <input type="password" name='cpassword' onChange={handleOnChanche} value={inputVal.cpassword} />
                        </div>
                    }
                </form>
                <div className='signinBtnCont'>
                    {funcEamilCall &&
                        <button onClick={funcEmail}>Continue</button>
                    }
                    {funcOtpCall &&
                        <button onClick={funcOtp}>Verify</button>
                    }
                    {funcSetPassCall &&
                        <button onClick={funcResetPass}>Reset Password</button>
                    }
                </div>
                <div className='orContinueWithCont'>
                    <div></div>
                    <p>Or continue with</p>
                    <div></div>
                </div>
                <div className='logingWiothOtpBtn'>
                    <button onClick={() => { Navigate('/') }} >Login</button>
                </div>
            </div>
            <div className='logo'>
                <div></div>
                <img src={logo} alt="logo" />
                <div></div>
            </div>
        </div>
    )
}

export default ForgotPass

import React, { useState } from 'react'
import './CSS/Verify.css'
import logo from '../img/logo.png'
import OtpInput from 'react-otp-input'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Verify = () => {
    const nevigate = useNavigate()
    const [otp, setOtp] = useState('');
    const URL = process.env.REACT_APP_BACKEND_URL
    const funcVerify = () => {
        const Email = localStorage.getItem('email')
        const adminType = localStorage.getItem('adminType')
        let extraUrl;
        if (adminType === 'superAdmin') {
            extraUrl = `/superadmin/login/verify`
        }
        else if (adminType === 'dataEntryOpt') {
            extraUrl = `/admin/dataentryopt/login/verify`
        }
        else if (adminType === 'userAdmin') {
            extraUrl = `/admin/useradmin/login/verify`
        }
        else {
            toast.error("Admin Is not Valid")
            return;
        }

        const Data = {
            email: Email,
            otp: otp
        }
        axios.post(`${URL}${extraUrl}`, Data).then((response) => {
            localStorage.setItem('adminInfo', JSON.stringify(response.data))
            nevigate('/admin/dashbord')
            window.location.reload();
        }).catch(err => {
            toast.error(err.response.data)
        })
    }
    return (
        <div className='VerifyCont'>
            <div className="optVerifyCont">
                <ToastContainer />
                <div className="head">
                    <h2>Enter Verification Code</h2>
                    <p>Check your email for a 6 digit verification code</p>
                </div>
                <div className="form">
                    <OtpInput
                        numInputs={6}
                        renderSeparator={<span style={{ width: "11px" }}></span>}
                        renderInput={(props) => <input {...props} />}
                        isInputNum={true}
                        shouldAutoFocus={true}
                        value={otp}
                        onChange={setOtp}
                        inputStyle={{
                            border: "1px solid #D4D4D4",
                            borderRadius: "6px",
                            width: "40px",
                            height: "40px",
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "bold",
                            caretColor: "blue",
                            outline: "none"
                        }}
                    />
                    <p>Having issue with login?</p>
                    <button onClick={funcVerify}>Submit</button>
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

export default Verify

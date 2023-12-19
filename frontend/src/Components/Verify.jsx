import React, { useEffect, useState } from 'react'
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
    const [userInfos, setUserinfos] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        otp: ''
    })
    const URL = process.env.REACT_APP_BACKEND_URL

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const Data = {
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            password: userInfo.password,
            otp: otp
        }
        setUserinfos(Data)

    }, [otp])

    const funcVerify = () => {

        axios.post(`${URL}/verify`, userInfos).then((response) => {
            if (response.data.status === 400 || response.data.status === 403 || response.data.status === 500) {
                toast.error(response.data.message)
                return;
            }
            nevigate('/')
        }).catch(err => {
            toast.error(err)
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

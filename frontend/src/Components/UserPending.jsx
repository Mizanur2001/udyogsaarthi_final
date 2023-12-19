import React from 'react'
import sandWating from '../img/icons8-sand-watch-100 1.png'
import loader from '../img/Update Left Rotation.png'
import logo from '../img/logo.png'
import './CSS/UserPending.css'
import { useNavigate } from 'react-router-dom'

const UserPending = () => {
    const nevigate = useNavigate()
    return (
        <div className='waitingContainer'>
            <div className='waitingHeadCont'>
                <h1>Waiting for administrative approval</h1>
                <div className='waitingWrapper'>
                    <div className='waitingImgWrapper'>
                        <img src={sandWating} alt="sand waiting" />
                        <div className='loaderCont' onClick={() => { nevigate('/') }}>
                            <img src={loader} alt="loader" />
                            <p>Refreh Status here</p>
                        </div>
                    </div>
                    <div className='orContBtnWrapper'>
                        <div className='orCont'>
                            <div></div>
                            <p>Or</p>
                            <div></div>
                        </div>
                        <div className='loginBtn'>
                            <button onClick={() => { nevigate('/') }}>Back to Login Page</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="logo">
                <div></div>
                <img src={logo} alt="logo" />
                <div></div>
            </div>
        </div>
    )
}

export default UserPending

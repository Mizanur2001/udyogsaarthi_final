import React from 'react'
import './CSS/SingleResume.css'
import logo from '../img/logo.png'
import back from '../img/Icons/back.svg'
import { useLocation, useNavigate } from 'react-router-dom';

const SingleResume = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchData = location.state?.Data;

    console.log(searchData)
    return (
        <div className='SingleResumeCont'>
            <div className='logo'>
                <img src={logo} alt="Logo" />
            </div>
            <div className="backCont" onClick={() => { navigate(-1) }}>
                <img src={back} alt="Back" />
                <p>Back</p>
            </div>
            <div className="singleResumeWrapper">
                <div className="longInfo">
                    <h3>More Info</h3>
                    {searchData && (
                        <div className='fullInfoDev'>
                            {Object.entries(searchData).map(([key, value]) => (
                                key !== 'id' && <p key={key}>
                                    <strong>{key}:</strong> {value}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SingleResume

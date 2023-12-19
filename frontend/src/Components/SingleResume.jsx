import React from 'react'
import './CSS/SingleResume.css'
import logo from '../img/logo.png'
import back from '../img/Icons/back.svg'
import Phone from '../img/Icons/phone.svg'
import Email from '../img/Icons/email.svg'
import defaultUser from '../img/DefaultUser.png'
import { useLocation, useNavigate } from 'react-router-dom';
import wpIcon from '../img/Icons/wpIcon.svg'

const SingleResume = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchData = location.state?.Data;
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
                <div className="shortInfo">
                    <img src={searchData.imageurl === undefined ? defaultUser : process.env.REACT_APP_PUBLIC_IMG_FOLDER + searchData.imageurl} alt="pofileImg" />
                    <div className="info">
                        <div className="perInfo">
                            <p>{searchData.name}</p>
                            <p>{searchData.profession}</p>
                        </div>
                        <div className="contactInfo">
                            <p>
                                <a href={`tel:${searchData.phone}`}>
                                    Tel: {searchData.phone}
                                </a>
                                <a href={`https://wa.me/+91${searchData.phone}`}>
                                    <img src={wpIcon} alt="" />
                                </a>
                            </p>
                            <p>
                                <a href={`mailto:${searchData.email}`}>
                                    Email: {searchData.email}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="shortInfoMobile">
                    <div className="perInfo">
                        <img src={searchData.imageurl === undefined ? defaultUser : process.env.REACT_APP_PUBLIC_IMG_FOLDER + searchData.imageurl} alt="ProfileImg" />
                        <div className="ParaCont">
                            <p>{searchData.name}</p>
                            <p>{searchData.profession}</p>
                        </div>
                    </div>
                    <div className="contactInfo">
                        <div className="Mobile">
                            <a href={`tel:${searchData.phone}`}>
                                <img src={Phone} alt="pone" />
                            </a>
                            <p>{searchData.phone}</p>
                            <a href={`https://wa.me/+91${searchData.phone}`}>
                                <img src={wpIcon} alt="" />
                            </a>
                        </div>
                        <div className="email">
                            <a href={`mailto:${searchData.email}`}>
                                <img src={Email} alt="email" />
                            </a>
                            <p>{searchData.email}</p>
                        </div>
                    </div>
                </div>
                <div className="longInfo">
                    <h3>More About</h3>
                    {searchData.extraData.map((data, index) => (
                        <div key={index}>
                            {Object.entries(data).map(([key, value]) => {
                                // Exclude rendering the 'ImageUrl' key
                                if (key === 'ImageUrl') {
                                    return null;
                                }
                                return (
                                    <p key={key}>
                                        <strong>{key}:</strong> {value}
                                    </p>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleResume

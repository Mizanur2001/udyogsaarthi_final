import React, { useState } from 'react'
import logo from '../img/logo.png'
import search from '../img/Icons/searchWhite.svg'
import searchInc from '../img/Icons/search.svg'
import './CSS/SearhEngine.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SearchEngine = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const navigate = useNavigate();
    const [inputVal, setInputVal] = useState({ search: "" })
    const funcLogout = () => {
        localStorage.removeItem('userInfo')
        window.location.reload()
    }

    const handleOnChanche = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            funcSearch();
        }
    };

    const funcSearch = () => {
        axios.post(`${URL}/users/search/quary`, inputVal, {
            headers: {
                authToken: localStorage.getItem('userInfo')
            }
        }).then((response) => {
            navigate('/searchresults', { state: { searchData: response.data } });

        }).catch(err => {
            console.log(err.response.data)
        })
    }

    return (
        <div className='SearchEngineWrapper'>
            <div className="logo">
                <img src={logo} alt="Logo" className='mainLogo' />
                <button onClick={funcLogout} className='logOut'>Logout</button>
            </div>
            <div className='SearchEngineCont'>
                <div className='hiddenDiv'></div>
                <div className="SearchEngineWrapper">
                    <div className="slogan">
                        <h3>Search for people anytime anywhere...</h3>
                    </div>
                    <img src={logo} alt="logo" className='inputUpLogo'/>
                    <div className="inputContWeb">
                        <input type="text" placeholder='Search the web...' name='search' onChange={handleOnChanche} value={inputVal.search} onKeyPress={handleKeyPress} />
                        <div className="iconCont" onClick={funcSearch}>
                            <img src={search} alt="Search" />
                        </div>
                    </div>
                    <div className="inputContMob">
                        <div className="iconCont">
                            <img src={searchInc} alt="Search" />
                        </div>
                        <input type="text" placeholder='Search the web...' name='search' onChange={handleOnChanche} value={inputVal.search} onKeyPress={handleKeyPress} />
                    </div>
                    <div className="tagsCont">
                        <div className="tags" onClick={() => setInputVal({ search: "Doctor" })}>
                            <p>Doctor</p>
                        </div>
                        <div className="tags" onClick={() => setInputVal({ search: "IAS" })}>
                            <p>IAS</p>
                        </div>
                        <div className="tags" onClick={() => setInputVal({ search: "Journalists" })}>
                            <p>Journalists</p>
                        </div>
                        <div className="tags" onClick={() => setInputVal({ search: "Police" })}>
                            <p>Police</p>
                        </div>
                        <div className="tags" onClick={() => setInputVal({ search: "Cyber Officer" })}>
                            <p>Cyber Officer</p>
                        </div>
                    </div>
                    <div className='hiddenDiv'></div>
                    <div className='hiddenDiv'></div>
                </div>
                <div className="sideImg">
                    <div className='logo'>
                        <div></div>
                        <img src={logo} alt="logo" />
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchEngine

import React from 'react'
import './CSS/SearchResults.css'
import logo from '../img/logo.png'
import back from '../img/Icons/back.svg'
import Cross from '../img/Icons/Cross.svg'
import filter from '../img/Icons/filter.svg'
import defaultUser from '../img/DefaultUser.png'
import notFound from '../img/notFound.png'
import { useLocation, useNavigate } from 'react-router-dom'


const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchData = location.state?.searchData;
    return (
        <div className='searchResultsConst'>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="searchBar">
                <div className="BackCont" onClick={() => {
                    navigate('/search')
                }}>
                    <img src={back} alt="Back" />
                    <p>Back</p>
                </div>
                <div className="inputCont">
                    <input type="text" />
                    <img src={Cross} alt="" />
                </div>
            </div>
            <div className="filter">
                <p>Filter</p>
                <img src={filter} alt="filter" />
            </div>
            <div className="reasultsCont">
                {searchData &&
                    searchData.map((data) => {
                        return (
                            <div className="result" key={data._id} >
                                <img src={data.imageurl === undefined ? defaultUser : process.env.REACT_APP_PUBLIC_IMG_FOLDER + data.imageurl} alt="ProfileImg" />
                                <div className="info">
                                    <p>{data.name}</p>
                                    <p>{data.profession}</p>
                                    <p>{data.email}</p>
                                    <button onClick={() => { navigate('/search/resumea', { state: { Data: data } }) }}>Show More</button>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    (searchData && searchData.length === 0) &&
                    <div className='notFoundCont'>
                        <h3>No Data Found</h3>
                        <img src={notFound} alt="not  found" />

                    </div>
                }
                {
                    (searchData === undefined) &&
                    <div className='notFoundCont'>
                        <h3>No Data Found</h3>
                        <img src={notFound} alt="not  found" />

                    </div>
                }
            </div>
        </div>
    )
}

export default SearchResults

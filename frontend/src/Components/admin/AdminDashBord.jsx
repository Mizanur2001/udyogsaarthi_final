import React, { useEffect, useState } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/AdminDashBord.css'
import DalyuserVisited from '../Charts/DalyuserVisited'
import axios from 'axios'

const AdminDashBord = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const [Data, setData] = useState('')

    useEffect(() => {
        axios.get(`${URL}/admin/dashbord/count`, {
            headers: {
                authToken: JSON.parse(localStorage.getItem('adminInfo')).token === undefined ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setData(response.data)
        }).catch(err => {
            console.log(err)
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className='adminDashBord'>
            <DashBord />
            <div className='adminDashBordPanel'>
                <div className="header">
                    <p>Overview</p>
                </div>
                <div className="body">
                    <div className="statusCont">
                        <div className="adminStatusBox totalUsers" >
                            <p>Total Users</p>
                            <p>{Data.users}</p>
                            <p>Total number of approved users</p>
                        </div>
                        <div className="adminStatusBox totalData" >
                            <p>Total Data</p>
                            <p>{Data.datas}</p>
                            <p>Total number of entries</p>
                        </div>
                        <div className="adminStatusBox totalAdmin" >
                            <p>Total User Admins</p>
                            <p>{Data.userAdmin}</p>
                            <p>Number of Total User Admin</p>
                        </div>
                        <div className="adminStatusBox totalOperators" >
                            <p>Total operators</p>
                            <p>{Data.dataEntryOptModel}</p>
                            <p>Number of total operatores</p>
                        </div>
                    </div>
                    <DalyuserVisited />
                </div>
            </div>
        </div>
    )
}

export default AdminDashBord

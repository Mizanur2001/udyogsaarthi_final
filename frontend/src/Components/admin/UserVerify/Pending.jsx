import React, { useEffect, useState } from 'react'
import '../../CSS/admin/UserVerify/Pending.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loder from '../../../img/Icons/loder.svg'

const Pending = ({ allUsers, setCountSeter }) => {

    const URL = process.env.REACT_APP_BACKEND_URL
    const currentDate = new Date();
    const time = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
    const [allUsersData, setAllUsersData] = useState('')
    const [functionsCalled, setFunctionsCalled] = useState(false);
    const [loder, setLoder] = useState(false)

    const funcApprove = (email) => {

        const data = {
            userEmail: email,
            status: "active",
            adminName: JSON.parse(localStorage.getItem('adminInfo')).adminName === undefined ? "Super Admin" : JSON.parse(localStorage.getItem('adminInfo')).adminName,
            time: time
        }

        axios.put(`${URL}/admin/useradmin/verifyuser`, data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((responce) => {
            toast.success(responce.data);
            setFunctionsCalled(true)
            setCountSeter(true)
            // window.location.reload()
        }).catch(err => console.log(err))
    }

    const funcReject = (email) => {
        const data = {
            userEmail: email,
            status: "rejected",
            adminName: JSON.parse(localStorage.getItem('adminInfo')).adminName === undefined ? "Super Admin" : JSON.parse(localStorage.getItem('adminInfo')).adminName,
            time: time
        }

        axios.put(`${URL}/admin/useradmin/verifyuser`, data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((responce) => {
            toast.success(responce.data);
            setFunctionsCalled(true)
            setCountSeter(true)
            // window.location.reload()
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        setLoder(true)
        axios.get(`${URL}/admin/useradmin/getallusers`, {
            headers: {
                'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((Responce) => {
            setAllUsersData(Responce.data)
            setCountSeter(true)
            setLoder(false)
        }).catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

    if (functionsCalled) {
        axios.get(`${URL}/admin/useradmin/getallusers`, {
            headers: {
                'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((Responce) => {
            setAllUsersData(Responce.data)
            setCountSeter(true)
        }).catch(err => console.log(err))
        setFunctionsCalled(false)
    }


    return (
        <div className="pendingUserCont">
            <ToastContainer />
            <div className='hrLine'></div>
            <table border={0}>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Accout Status</th>
                        <th>Action</th>
                    </tr>
                    {allUsersData &&
                        allUsersData.map((users) => {
                            if (users.status === 'pending') {
                                return (
                                    <tr key={users._id}>
                                        <td>{users.name}</td>
                                        <td>{users.email}</td>
                                        <td>{users.age}</td>
                                        <td>{users.phone}</td>
                                        <td>{users.status}</td>
                                        <td>
                                            <button className='approveBtn' onClick={() => { funcApprove(users.email) }} >Approve</button>
                                            <button className='rejectBtn' onClick={() => { funcReject(users.email) }}>Reject</button>
                                        </td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr key={users._id}></tr>
                                )
                            }
                        })}
                </tbody>
            </table>
            {loder &&
                <div id="loder">
                    <img src={Loder} alt="loder" />
                </div>
            }
        </div>
    )
}

export default Pending
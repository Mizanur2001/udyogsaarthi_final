import React, { useState } from 'react'
import '../CSS/admin/UserVerify.css'
import DashBord from './DashBord'
import Pending from './UserVerify/Pending'
import Approved from './UserVerify/Approved'
import Rejected from './UserVerify/Rejected'
import Total from './UserVerify/Total'
import axios from 'axios'
import { useEffect } from 'react'


const UserVerify = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const [userStatusBox, setUserStatusBox] = useState('pendingUser')
    const [allUsers, setAllUsers] = useState(null)
    const [active, setActive] = useState(0)
    const [pending, setPending] = useState(0)
    const [rejected, setRejected] = useState(0)
    const [coutSeter, setCountSeter] = useState(false)

    useEffect(() => {
        axios.get(`${URL}/admin/useradmin/getallusers`, {
            headers: {
                'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((Responce) => { setAllUsers(Responce.data) }).catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

    const funcUserStatus = (status) => {
        setUserStatusBox(status.status)
    }

    //count Users status 


    useEffect(() => {
        let activeCount = 0;
        let pendingCount = 0;
        let rejectedCount = 0;
        if (allUsers) {
            for (const user of allUsers) {
                switch (user.status) {
                    case 'active':
                        setActive(++activeCount)
                        break;
                    case 'pending':
                        setPending(++pendingCount)
                        break;
                    case 'rejected':
                        setRejected(++rejectedCount)
                        break;
                    default:
                        break;
                }
            }
        }

    }, [allUsers]);


    if (coutSeter) {
        axios.get(`${URL}/admin/useradmin/getallusers`, {
            headers: {
                'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((Responce) => { setAllUsers(Responce.data) }).catch(err => console.log(err))

        let activeCount = 0;
        let pendingCount = 0;
        let rejectedCount = 0;

        if (allUsers) {

            setActive(0)
            setPending(0)
            setRejected(0)
            for (const user of allUsers) {
                switch (user.status) {
                    case 'active':
                        setActive(++activeCount)
                        break;
                    case 'pending':
                        setPending(++pendingCount)
                        break;
                    case 'rejected':
                        setRejected(++rejectedCount)
                        break;
                    default:
                        break;
                }
            }

        }

        setCountSeter(false)
    }

    return (
        <div className='UserVerifyCont'>
            <DashBord />
            <div className="verificationPanelCont">
                <div className="header">
                    <p>User verification panel</p>
                </div>
                <div className="body">
                    <div className="timeLine">
                        <ul>
                            <li className='active'>Last 7 days</li>
                            <li>Last 30 days</li>
                            <li>All Time</li>
                        </ul>
                    </div>
                    <div className="userStatusCont">
                        <div className={`${userStatusBox === 'approvedUser' ? 'approvedUser' : ''} userStatusBox`} onClick={() => funcUserStatus({ status: 'approvedUser' })}>
                            <p>Approved Users</p>
                            <p>{active}</p>
                            <p>Total number of approved users</p>
                        </div>
                        <div className={`${userStatusBox === 'pendingUser' ? 'pendingUser' : ''} userStatusBox`} onClick={() => funcUserStatus({ status: 'pendingUser' })}>
                            <p>Pending Users</p>
                            <p>{pending}</p>
                            <p>Total number of pending account Verification</p>
                        </div>
                        <div className={`${userStatusBox === 'rejectedUser' ? 'rejectedUser' : ''} userStatusBox`} onClick={() => funcUserStatus({ status: 'rejectedUser' })}>
                            <p>Rejected Users</p>
                            <p>{rejected}</p>
                            <p>Numbers of rejected users</p>
                        </div>
                        <div className={`${userStatusBox === 'totalUser' ? 'totalUser' : ''} userStatusBox`} onClick={() => funcUserStatus({ status: 'totalUser' })}>
                            <p>Total Request</p>
                            <p>{allUsers && allUsers.length}</p>
                            <p>Total number of  requested signup (History)</p>
                        </div>
                    </div>
                    {
                        userStatusBox === 'pendingUser' &&
                        <Pending allUsers={allUsers} setCountSeter={setCountSeter} />
                    }
                    {
                        userStatusBox === 'approvedUser' &&
                        <Approved allUsers={allUsers} setCountSeter={setCountSeter} />
                    }
                    {
                        userStatusBox === 'rejectedUser' &&
                        <Rejected allUsers={allUsers} setCountSeter={setCountSeter} />
                    }
                    {
                        userStatusBox === 'totalUser' &&
                        <Total allUsers={allUsers} setCountSeter={setCountSeter} />
                    }
                </div>
            </div>
        </div>
    )
}

export default UserVerify

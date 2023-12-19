import React, { useEffect, useState, useRef } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/UsersAdmin.css'
import Delete from '../../img/Icons/delete.svg'
import Edit from '../../img/Icons/edit.svg'
import UserAdminEdit from '../Models/UserAdminEdit'
import Add from '../../img/Icons/add.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loder from '../../img/Icons/loder.svg'

const UsersAdmin = () => {
    const [openModel, setOpenModel] = useState(false)
    const [fetchAllUserAdmin, setFetchAllUserAdmin] = useState('')
    const [addData, setAdddata] = useState(false)
    const [adminInfo, setAdminInfo] = useState('')
    const URL = process.env.REACT_APP_BACKEND_URL
    const inputFileRef = useRef(null);
    const [funcCall, setFuncCall] = useState(false)
    const [modelFuncCall, setModelFuncCall] = useState(false)
    const [loder, setLoder] = useState(false)
    const [inputVal, setInputVal] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    })

    useEffect(() => {
        setLoder(true)
        axios.get(`${URL}/admin/useradmin/getalladmin`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setFetchAllUserAdmin(response.data)
            setLoder(false)
        }).catch(err => { console.log(err) })

        // eslint-disable-next-line
    }, [])

    if (funcCall) {
        axios.get(`${URL}/admin/useradmin/getalladmin`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setFetchAllUserAdmin(response.data)
        }).catch(err => { console.log(err) })
        setFuncCall(false)
    }

    if (modelFuncCall) {
        axios.get(`${URL}/admin/useradmin/getalladmin`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setFetchAllUserAdmin(response.data)
        }).catch(err => { console.log(err) })
        setModelFuncCall(false)
    }

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                setAdddata(true);
                if (inputFileRef.current) {
                    inputFileRef.current.focus();
                }
            }
        })
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'q') {
                setAdddata(false);
            }
        })
    }, [])

    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const SignUp = () => {
        const Data = {
            name: inputVal.name,
            phone: inputVal.phone,
            email: inputVal.email,
            password: inputVal.password
        }

        axios.post(`${URL}/admin/useradmin/signup`, Data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data);
            setAdddata(false)
            // window.location.reload();
            setInputVal({
                name: "",
                email: "",
                password: "",
                phone: ""
            })
            setFuncCall(true)
        }).catch(err => { toast.error(err.response.data) })
    }


    return (
        <div className='UsersAdmin'>
            <ToastContainer />
            <DashBord />
            <div className="userAdminPanel">
                <div className="header">
                    <p>User Admin Management</p>
                </div>
                <div className="body">
                    <div className="statusCont">
                        <div className="activeAdmin" >
                            <p>Active Admins</p>
                            <p>{fetchAllUserAdmin.length}</p>
                            <p>Number of currently active admins</p>
                        </div>
                        <div className="inputCont">
                            <div className="addEntryCont" onClick={() => { setAdddata(true) }}>
                                <button className='addBtn'>Add Admin</button>
                                <img src={Add} alt="Add" />
                            </div>
                        </div>
                    </div>
                    <div className="tableCont">
                        <UserAdminEdit openModel={openModel} setOpenModel={setOpenModel} adminInfo={adminInfo} setModelFuncCall={setModelFuncCall} />
                        <div className='hrLine'></div>
                        <table border={0}>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Password</th>
                                    <th>Action</th>
                                </tr>
                                {addData &&
                                    <tr className='dataEntryCont'>
                                        <th><input ref={inputFileRef} type="text" name='name' value={inputVal.name} onChange={handleOnchange} /></th>
                                        <th><input type="email" name='email' value={inputVal.email} onChange={handleOnchange} /></th>
                                        <th><input type="number" name='phone' value={inputVal.phone} onChange={handleOnchange} /></th>
                                        <th><input type="text" name='password' value={inputVal.password} onChange={handleOnchange} /></th>
                                        <th><button onClick={() => SignUp()}>Add</button></th>
                                    </tr>
                                }
                                {fetchAllUserAdmin &&
                                    fetchAllUserAdmin.map((admin) => {
                                        return (
                                            <tr key={admin._id}>
                                                <td>{admin.name}</td>
                                                <td>{admin.email}</td>
                                                <td>{admin.phone}</td>
                                                <td>{admin.password == null ? "N/A" : "Assigned"}</td>
                                                <td>
                                                    <img src={Delete} alt="Delete" onClick={() => { setOpenModel(true); setAdminInfo(admin) }} />
                                                    <img src={Edit} alt="Edit" onClick={() => { setOpenModel(true); setAdminInfo(admin) }} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {loder &&
                            <div id="loder">
                                <img src={Loder} alt="loder" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersAdmin

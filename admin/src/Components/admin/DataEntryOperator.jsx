import React, { useEffect, useState, useRef } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/DataEntryOperator.css'
import eye from '../../img/Icons/eye.svg'
import gere from '../../img/Icons/redGere.svg'
import OperatorEdit from '../Models/OperatorEdit'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Add from '../../img/Icons/add.svg'
import OptEntryShow from '../Models/OptEntryShow'
import Loder from '../../img/Icons/loder.svg'

const DataEntryOperator = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const [openModel, setOpenModel] = useState(false)
    const [openOptShowModel, setOpenOptShowModel] = useState(false)
    const [allOpt, setAllOpt] = useState('')
    const [optInfo, setOptInfo] = useState('')
    const [addData, setAdddata] = useState(false)
    const [editAdmin, setEditAdmin] = useState(false)
    const inputFileRef = useRef(null);
    const [dataOpt, setDataOpt] = useState('')
    const [addAdmin, setAddAdmin] = useState(false)
    const [loder, setLoder] = useState(false)
    const [inputVal, setInputVal] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    })

    useEffect(() => {
        setLoder(true)
        axios.get(`${URL}/admin/dataentryopt/getallopt`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((responce) => {
            setAllOpt(responce.data)
            setLoder(false)
        }).catch(err => {
            console.log(err.response.data)
        })

        // eslint-disable-next-line
    }, [])

    if (addAdmin) {
        axios.get(`${URL}/admin/dataentryopt/getallopt`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((responce) => {
            setAllOpt(responce.data)
        }).catch(err => {
            console.log(err.response.data)
        })
        setAddAdmin(false)
    }

    if (editAdmin) {
        axios.get(`${URL}/admin/dataentryopt/getallopt`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((responce) => {
            setAllOpt(responce.data)
        }).catch(err => {
            console.log(err.response.data)
        })
        setEditAdmin(false)
    }

    const handleEditPermissionChange = (operatorEmail) => {
        // Find the operator with the given email
        const operator = allOpt.find((opt) => opt.email === operatorEmail);
        if (operator) {
            // Toggle the edit permission
            const updatedPermissions = { ...operator.permissions, edit: !operator.permissions.edit };
            updateOperatorPermissions(operatorEmail, updatedPermissions);
        }
    };

    const handleEntryPermissionChange = (operatorEmail) => {
        // Find the operator with the given email
        const operator = allOpt.find((opt) => opt.email === operatorEmail);
        if (operator) {
            // Toggle the entry permission
            const updatedPermissions = { ...operator.permissions, entry: !operator.permissions.entry };
            updateOperatorPermissions(operatorEmail, updatedPermissions);
        }
    };

    const updateOperatorPermissions = (operatorEmail, updatedPermissions) => {
        const Data = {
            email: operatorEmail,
            edit: updatedPermissions.edit,
            entry: updatedPermissions.entry,
        };
        axios.put(`${URL}/admin/dataentryopt/permissions`, Data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            },
        }).then((response) => {
            // Update the operator's permissions in the local state
            setAllOpt((prevOpt) =>
                prevOpt.map((opt) => {
                    if (opt.email === operatorEmail) {
                        return { ...opt, permissions: updatedPermissions };
                    }
                    return opt;
                })
            );
            toast.success(response.data);
        }).catch((err) => {
            toast.error(err.response.data)
        });
    };

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

        axios.post(`${URL}/admin/dataentryopt/signup`, Data, {
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
            setAddAdmin(true)
        }).catch(err => { toast.error(err.response.data) })
    }


    return (
        <div className='DataEntryOperator'>
            <ToastContainer />
            <DashBord />
            <div className="dataEntyOperatorPanel">
                <div className="header">
                    <p>Data Entry Operators</p>
                </div>
                <div className="body">
                    <OperatorEdit openModel={openModel} setOpenModel={setOpenModel} optInfo={optInfo} setEditAdmin={setEditAdmin} />
                    <OptEntryShow openModel={openOptShowModel} setOpenModel={setOpenOptShowModel} dataOpt={dataOpt} />
                    <div className="statusCont">
                        <div className="activeAdmin" >
                            <p>Total Operators</p>
                            <p>{allOpt && allOpt.length}</p>
                            <p>Number of currently active operators</p>
                        </div>
                        <div className="inputCont">
                            <div className="addEntryCont" onClick={() => { setAdddata(true) }}>
                                <button className='addBtn'>Add Admin</button>
                                <img src={Add} alt="Add" />
                            </div>
                        </div>
                    </div>
                    <div className="tableCont">
                        <div className='hrLine'></div>
                        <table border={0}>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Password</th>
                                    <th>Action</th>
                                    <th>
                                        <p>Prmissions</p>
                                        <div className='permitions'>
                                            <p>Edit</p>
                                            <p>Entry</p>
                                        </div>
                                    </th>
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
                                {allOpt &&
                                    allOpt.map((opt) => {
                                        return (
                                            <tr key={opt._id}>
                                                <td>{opt.name}</td>
                                                <td>{opt.email}</td>
                                                <td>{opt.phone}</td>
                                                <td>{opt.password == null ? 'N/A' : 'Assigned'}</td>
                                                <td>
                                                    <img src={eye} alt="eye" onClick={() => { setOpenOptShowModel(true); setDataOpt(opt) }} />
                                                    <img src={gere} alt="gere" onClick={() => { setOpenModel(true); setOptInfo(opt) }} />
                                                </td>
                                                <td>
                                                    <label className="switch">
                                                        <input type="checkbox" checked={opt.permissions.edit} onChange={() => handleEditPermissionChange(opt.email)} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                    <label className="switch">
                                                        <input type="checkbox" checked={opt.permissions.entry} onChange={() => handleEntryPermissionChange(opt.email)} />
                                                        <span className="slider round"></span>
                                                    </label>
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

export default DataEntryOperator

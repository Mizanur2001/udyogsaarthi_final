import React, { useState, useEffect } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const OperatorEdit = ({ openModel, setOpenModel, optInfo, setEditAdmin }) => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const theme = useMantineTheme();
    const [inputVal, setInputVal] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    })
    useEffect(() => {
        setInputVal({
            name: optInfo.name,
            email: optInfo.email,
            phone: optInfo.phone
        })
    }, [optInfo.email, optInfo.name, optInfo.phone])

    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSaveDetails = (e) => {
        e.preventDefault()
        const Data = {
            id: optInfo._id,
            name: inputVal.name,
            email: inputVal.email,
            phone: inputVal.phone,
            password: inputVal.password
        }

        axios.put(`${URL}/admin/dataentryopt/updateopt`, Data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data)
            // window.location.reload();
            setEditAdmin(true)
            setOpenModel(false)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const funcDelete = (e) => {
        e.preventDefault()
        console.log(optInfo._id)
        axios.delete(`${URL}/admin/dataentryopt/deleteopt`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            },
            data: {
                id: optInfo._id
            }
        }).then((responce) => {
            toast.success(responce.data)
            // window.location.reload();
            setEditAdmin(true)
            setOpenModel(false)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }


    return (
        <div>
            <ToastContainer />
            <Modal
                overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 4,
                }}
                size="40%"
                opened={openModel}
                onClose={() => setOpenModel(false)}
            >
                <form className='userEditCont'>
                    <h3>Operators account details</h3>
                    <div className="inputCont">
                        <input type="text" value={inputVal.name} onChange={handleOnchange} name='name' placeholder='Name' />
                        <input type="email" value={inputVal.email} onChange={handleOnchange} name='email' placeholder='Email' />
                        <input type="number" value={inputVal.phone} onChange={handleOnchange} name='phone' placeholder='Phone Number' />
                        <input type="text" value={inputVal.password} onChange={handleOnchange} name='password' placeholder='Enter A Strong Password' />
                    </div>
                    <div className="btnCont">
                        <button className='saveBtn' onClick={funcSaveDetails}>Save Details</button>
                        <button className='DeleteBtn' onClick={funcDelete}>Delete Account</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default OperatorEdit

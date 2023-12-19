import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const ShareModel = ({ openModel, setOpenModel, adminInfo , setModelFuncCall}) => {
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
            name: adminInfo.name,
            email: adminInfo.email,
            phone: adminInfo.phone
        })
    }, [adminInfo.email, adminInfo.name, adminInfo.phone])

    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSaveDetails = (e) => {
        e.preventDefault()
        const Data = {
            id: adminInfo._id,
            name: inputVal.name,
            email: inputVal.email,
            phone: inputVal.phone,
            password: inputVal.password
        }

        axios.post(`${URL}/admin/useradmin/editadmin`, Data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data)
            // window.location.reload();
            setModelFuncCall(true)
            setOpenModel(false)
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const funcDelete = (e) => {
        e.preventDefault()
        console.log(adminInfo._id)
        axios.delete(`${URL}/admin/useradmin/deleteadmin`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            },
            data: {
                id: adminInfo._id
            }
        }).then((responce) => {
            toast.success(responce.data)
            // window.location.reload();
            setModelFuncCall(true)
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
                    <h3>User Admin account details</h3>
                    <div className="inputCont">
                        <input type="text" value={inputVal.name} onChange={handleOnchange} name='name' placeholder='Name'/>
                        <input type="email" value={inputVal.email} onChange={handleOnchange} name='email' placeholder='Email'/>
                        <input type="number" value={inputVal.phone} onChange={handleOnchange} name='phone' placeholder='Phone Number'/>
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

export default ShareModel

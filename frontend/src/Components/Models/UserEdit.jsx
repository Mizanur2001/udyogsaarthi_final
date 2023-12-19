import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShareModel = ({ openModel, setOpenModel, userInfo, setFunctionsCalled }) => {

    const URL = process.env.REACT_APP_BACKEND_URL
    const [inputVal, setInputVal] = useState({
        name: "",
        email: "",
        age: "",
        phone: ""
    })

    useEffect(() => {
        setInputVal({
            name: userInfo.name,
            email: userInfo.email,
            age: userInfo.age,
            phone: userInfo.phone
        })
    }, [userInfo.age, userInfo.email, userInfo.name, userInfo.phone])

    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSaveDetails = (e) => {
        e.preventDefault()
        const Data = {
            userId: userInfo._id,
            userName: inputVal.name,
            userEmail: inputVal.email,
            age: inputVal.age,
            userPhone: inputVal.phone
        }
        axios.put(`${URL}/admin/useradmin/updateuser`, Data, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data)
           setFunctionsCalled(true)
            // window.location.reload();
            setOpenModel(false)
        }).catch(err => toast.error(err.response.data))
    }

    const funcDelete = (e) => {
        e.preventDefault()
        const Data = { userId: userInfo._id }
        axios.delete(`${URL}/admin/useradmin/deleteuser`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            },
            data: Data
        }).then((response) => {
            toast.success(response.data)
            // window.location.reload();
            setFunctionsCalled(true);
            setOpenModel(false)
        }).catch(err => toast.error(err.response.data))
    }

    const theme = useMantineTheme();
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
                    <h3>User account details</h3>
                    <div className="inputCont">
                        <input type="text" value={inputVal.name} onChange={handleOnchange} name='name' placeholder='Name' />
                        <input type="email" value={inputVal.email} onChange={handleOnchange} name='email' placeholder='Email' />
                        <input type="number" value={inputVal.age} onChange={handleOnchange} name='age' placeholder='Age' />
                        <input type="number" value={inputVal.phone} onChange={handleOnchange} name='phone' placeholder='Phone Number' />
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

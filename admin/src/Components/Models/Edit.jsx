import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const Edit = ({ openModel, setOpenModel, id, fetchJobs }) => {
    const URL = 'https://f087-125-17-180-42.ngrok-free.app'
    const theme = useMantineTheme();
    const [inputVal, setInputVal] = useState({
        title: '',
        description: '',
        location: '',
        company: '',
        salary_min: '',
        salary_max: '',
        application_deadline: ''
    })

    useEffect(() => {
        axios.get(`${URL}/jobs/${id}`).then((response) => {
            setInputVal({
                title: response.data.title,
                description: response.data.description,
                location: response.data.location,
                company: response.data.company,
                salary_min: response.data.salary_min,
                salary_max: response.data.salary_max,
                application_deadline: response.data.application_deadline
            })
        }).catch(err => {
            console.log(err)
        })
    }, [id])


    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSaveDetails = (e) => {
        e.preventDefault()

        axios.put(`${URL}/jobs/${id}/`, inputVal).then((response) => {
            toast.success("Data Updated successfully")
            setOpenModel(false)
            fetchJobs()
        }).catch(err => {
            console.log(err)
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
                    <h3>Edit Job Details</h3>
                    <div className="inputCont">
                        <input type="text" value={inputVal.title} onChange={handleOnchange} name='title' placeholder='Title' />
                        <input type="text" value={inputVal.description} onChange={handleOnchange} name='description' placeholder='Description' />
                        <input type="text" value={inputVal.location} onChange={handleOnchange} name='location' placeholder='Location' />
                        <input type="text" value={inputVal.company} onChange={handleOnchange} name='company' placeholder='Enter company name' />
                        <input type="number" value={inputVal.salary_min} onChange={handleOnchange} name='salary_min' placeholder='Enter min salary' />
                        <input type="number" value={inputVal.salary_max} onChange={handleOnchange} name='salary_max' placeholder='Enter max salary' />
                        <input type="text" value={inputVal.application_deadline} onChange={handleOnchange} name='application_deadline' placeholder='Enter application deadline(YYYY-MM-DD)' />
                    </div>
                    <div className="btnCont">
                        <button className='saveBtn' onClick={funcSaveDetails}>Save Details</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Edit
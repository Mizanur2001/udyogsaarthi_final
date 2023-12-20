import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const EditTtorial = ({ openModel, setOpenModel, id, fetchTutorial }) => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const theme = useMantineTheme();
    const [inputVal, setInputVal] = useState({
        title: '',
        description: '',
        duration: '',
        skills_taught: ""
    })

    useEffect(() => {
        axios.get(`${URL}/courses/${id}`).then((response) => {
            setInputVal({
                title: response.data.title,
                description: response.data.description,
                duration: response.data.duration,
                skills_taught: response.data.skills_taught,
            })
        }).catch(err => {
            console.log(err)
        })
        // eslint-disable-next-line
    }, [id])


    const handleOnchange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcSaveDetails = (e) => {
        e.preventDefault()

        axios.put(`${URL}/courses/${id}/`, inputVal).then((response) => {
            toast.success("Data Updated successfully")
            setOpenModel(false)
            fetchTutorial()
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
                        <input type="text" value={inputVal.duration} onChange={handleOnchange} name='duration' placeholder='Duration' />
                        <input type="text" value={inputVal.skills_taught} onChange={handleOnchange} name='skills_taught' placeholder='Enter skills Taught' />
                    </div>
                    <div className="btnCont">
                        <button className='saveBtn' onClick={funcSaveDetails}>Save Details</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default EditTtorial
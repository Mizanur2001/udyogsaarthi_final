import React, { useState, useEffect } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/UsersAdmin.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditTtorial from '../Models/EditTutorial';
const ManageTutorial = () => {

    const BaseURL = process.env.REACT_APP_BACKEND_URL
    const [jobs, setJobs] = useState([]);
    const [openModel, setOpenModel] = useState(false)
    const [id, setId] = useState()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        skills_taught: [],
    });

    function stringToArray(inputString) {
        const resultArray = inputString.split(',');

        return resultArray;
    }



    const fetchTutorial = async () => {
        axios.get(`${BaseURL}/courses`).then((response) => {
            console.log(response.data)
            setJobs(response.data)
        }).catch(err => {
            console.log(err)
        })
    };


    const createJob = async () => {
        axios.post(`${BaseURL}/courses/`, formData).then((response) => {
            setFormData({
                title: '',
                description: '',
                duration: '',
                company: '',
                skills_taught: []
            });
            toast.success("Tutorials Added Successfully")
            fetchTutorial();
        }).catch(err => {
            if (err.response && err.response.data) {
                const errorData = err.response.data;

                Object.keys(errorData).forEach(key => {
                    errorData[key].forEach(errorMessage => {
                        toast.error(`${key}: ${errorMessage}`);
                    });
                });
            } else {
                toast.error('An error occurred. Please try again.');
            }
        })
    };

    const deleteJob = async (jobId) => {
        axios.delete(`${BaseURL}/courses/${jobId}`).then((response) => {
            toast.success('Deleted Successfully')
            fetchTutorial();
        }).catch(err => {
            console.log(err)
        })
    };


    const updateJob = async (jobId) => {
        // Logic to delete a job by making a DELETE request to the API
    };

    useEffect(() => {
        fetchTutorial();
        // eslint-disable-next-line
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'skills_taught') {
            setFormData({
                ...formData,
                [e.target.name]: stringToArray(e.target.value)
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createJob();
    };

    return (
        <div className='UsersAdmin'>
            <ToastContainer />
            <DashBord />
            <EditTtorial openModel={openModel} setOpenModel={setOpenModel} id={id} fetchTutorial={fetchTutorial} />
            <div className="userAdminPanel">
                <div className="header">
                    <p>Tutorial Manage</p>
                </div>
                <div className="body">
                    <form className="jobForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <textarea
                            placeholder="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="formInput"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <input
                            type="text"
                            placeholder="skills_taught"
                            name="skills_taught"
                            value={formData.skills_taught}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <div className="CreateJobBtn">
                            <button type="submit" className="submitButton">Post Tutorials</button>
                        </div>
                    </form>

                    {/* Display list of jobs */}
                    <ul className="jobList">
                        {jobs.map((job) => (
                            <li key={job.id} className="jobItem">
                                <p><b>Title:</b> {job.title}</p>
                                <p><b>Description:</b> {job.description}</p>
                                <p><b>duration:</b> {job.duration}</p>
                                <p><b>skills_taught:</b> {job.skills_taught}</p>
                                <button onClick={() => deleteJob(job.id)} className="deleteButton">Delete</button>
                                <button onClick={() => { updateJob(job.id); setOpenModel(true); setId(job.id) }} className="updateButton">Update</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ManageTutorial

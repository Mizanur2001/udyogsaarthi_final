import React, { useState, useEffect } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/UsersAdmin.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ManageTutorial = () => {

    const BaseURL = process.env.REACT_APP_BACKEND_URL
    const [jobs, setJobs] = useState([]);
    const [openModel, setOpenModel] = useState(false)
    const [id, setId] = useState()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        company: '',
        salary_min: '',
        salary_max: '',
        application_deadline: ''
    });



    const fetchJobs = async () => {
        axios.get(`${BaseURL}/jobs`).then((response) => {
            setJobs(response.data)
        }).catch(err => {
            console.log(err)
        })
    };

    const createJob = async () => {
        axios.post(`${BaseURL}/jobs/`, formData).then((response) => {
            setFormData({
                title: '',
                description: '',
                location: '',
                company: '',
                salary_min: "",
                salary_max: "",
                application_deadline: ''
            });
            toast.success("Job Added Successfully")
            fetchJobs();
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
        axios.delete(`${BaseURL}/jobs/${jobId}`).then((response) => {
            toast.success('Deleted Successfully')
            fetchJobs();
        }).catch(err => {
            console.log(err)
        })
    };


    const updateJob = async (jobId) => {
        // Logic to delete a job by making a DELETE request to the API
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createJob();
    };

    return (
        <div className='UsersAdmin'>
            <ToastContainer />
            <DashBord />
            <div className="userAdminPanel">
                <div className="header">
                    <p>Admin Profile</p>
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
                            placeholder="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="formInput"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <input
                            type="text"
                            placeholder="Application Deadline (YYYY-MM-DD)"
                            name="application_deadline"
                            value={formData.application_deadline}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <input
                            type="number"
                            placeholder="Minimum Salary"
                            name="salary_min"
                            value={formData.salary_min}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <input
                            type="number"
                            placeholder="Maximum Salary"
                            name="salary_max"
                            value={formData.salary_max}
                            onChange={handleInputChange}
                            className="formInput"
                        />
                        <div className="CreateJobBtn">
                            <button type="submit" className="submitButton">Create Job</button>
                        </div>
                    </form>

                    {/* Display list of jobs */}
                    <ul className="jobList">
                        {jobs.map((job) => (
                            <li key={job.id} className="jobItem">
                                <p><b>Title:</b> {job.title}</p>
                                <p><b>Description:</b> {job.description}</p>
                                <p><b>Location:</b> {job.location}</p>
                                <p><b>Company:</b> {job.company}</p>
                                <p><b>Deadline:</b> {job.application_deadline}</p>
                                <p><b>Salary:</b> ₹ {job.salary_min} - ₹{job.salary_max}</p>
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

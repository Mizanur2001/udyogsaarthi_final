import React, { useState, useEffect } from 'react';
import DashBord from './DashBord';
import axios from 'axios'
import '../CSS/style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersAdmin = () => {
    const BaseURL = 'https://1d57-125-17-180-42.ngrok-free.app'
    const [jobs, setJobs] = useState([]);
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
        console.log(formData)
        axios.post(`${BaseURL}/jobs/`, formData).then((response) => {
            console.log(response)
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
        // Logic to delete a job by making a DELETE request to the API
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
            {/* Your Dashboard component */}
            <div className="userAdminPanel">
                <div className="header">
                    <p>Manage Jobs</p>
                </div>
                <div className="body">
                    {/* Job creation form */}
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
                        <button type="submit" className="submitButton">Create Job</button>
                    </form>

                    {/* Display list of jobs */}
                    <ul>
                        {jobs.map((job) => (
                            <li key={job.id}>
                                <p>Title: {job.title}</p>
                                <p>desc: {job.description}</p>
                                <p>Location: {job.location}</p>
                                <p>company: {job.company}</p>
                                <p>DeadLine: {job.application_deadline}</p>
                                <p>Salary: {`₹ ${job.salary_min} - ₹${job.salary_max}`}</p>
                                {/* Display other job details */}
                                <button onClick={() => deleteJob(job.id)}>Delete</button>
                                <button onClick={() => updateJob(job.id)}>Update</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UsersAdmin;

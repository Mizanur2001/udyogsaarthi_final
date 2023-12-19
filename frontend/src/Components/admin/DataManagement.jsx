import React, { useEffect, useState, useRef } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/DataManagement.css'
import search from '../../img/Icons/search.svg'
import Export from '../../img/Icons/export.svg'
import Add from '../../img/Icons/add.svg'
import defaultUser from '../../img/DefaultUser.png'
import edit from '../../img/Icons/edit.svg'
import gEye from '../../img/Icons/greenEye.svg'
import uploadImg from '../../img/UploadImg.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataEdit from '../Models/DataEdit'
import Compressor from 'compressorjs';
import Loder from '../../img/Icons/loder.svg'

const DataManagement = () => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const currentDate = new Date();
    const time = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
    const [addData, setAdddata] = useState(false)
    const [columnData, setColumnData] = useState()
    const [profileData, setProfileData] = useState()
    const inputFileRef = useRef(null);
    const [inputValues, setInputValues] = useState([]);
    const [inputValuesExtra, setInputValuesExtra] = useState({ name: "", imageUrl: "" })
    const [openModel, setOpenModel] = useState(false)
    const [dataInfo, setDataInfo] = useState('')
    const imageRef = useRef()
    const [image, setImage] = useState(null)
    const [addNewData, setAddNewData] = useState(false)
    const [editData, setEditData] = useState(false)
    const [loder, setLoder] = useState(false)

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

    useEffect(() => {
        setLoder(true)
        axios.get(`${URL}/admin/data/column/get`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setColumnData(response.data[0])
            setColumnData(pev => ({
                ...pev, addColumn: pev.addColumn.filter(column => column !== 'ImageUrl')
            }))
            setLoder(false)
        }).catch(err => {
            console.log(err)
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const adminType = localStorage.getItem('adminType')
        if (adminType === 'superAdmin') {
            axios.get(`${URL}/admin/dataentryopt/getalldata`, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then(response => {
                setProfileData(response.data)
            }).catch(err => {
                console.log(err)
            })
        }

        if (adminType === 'dataEntryOpt') {
            axios.get(`${URL}/admin/dataentryopt/getdata/opt`, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then(response => {
                setProfileData(response.data)
            }).catch(err => {
                console.log(err)
            })
        }
        // eslint-disable-next-line
    }, [])


    if (addNewData) {
        const adminType = localStorage.getItem('adminType')
        if (adminType === 'superAdmin') {
            axios.get(`${URL}/admin/dataentryopt/getalldata`, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then(response => {
                setProfileData(response.data)
            }).catch(err => {
                console.log(err)
            })
        }

        if (adminType === 'dataEntryOpt') {
            axios.get(`${URL}/admin/dataentryopt/getdata/opt`, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then(response => {
                setProfileData(response.data)
            }).catch(err => {
                console.log(err)
            })
        }
    }


    if (editData) {
        axios.get(`${URL}/admin/dataentryopt/getalldata`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then(response => {
            setProfileData(response.data)
        }).catch(err => {
            console.log(err)
        })
        setEditData(false)
    }

    const handleInputChange = (name, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        setInputValuesExtra({ ...inputValuesExtra, [e.target.name]: e.target.value })
    }

    const funcSendData = () => {
        const { email, phone, profession, ...remainingData } = inputValues;
        if (image) {
            const formData = new FormData()
            const fileName = Date.now() + "--" + image.name
            formData.append('name', fileName)
            formData.append('Photo', image)

            const Data = {
                "default": {
                    name: inputValuesExtra.name,
                    email: inputValues.email,
                    phone: inputValues.phone,
                    profession: inputValues.profession,
                    imageurl: fileName
                },
                "extraData": remainingData,
                dataEntryOpt: JSON.parse(localStorage.getItem('adminInfo')).adminName,
                date: time
            }

            axios.post(`${URL}/admin/dataentryopt/dataentry`, Data, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then((response) => {

                toast.success(response.data);
                axios.post(`${URL}/upload/img`, formData, {
                    headers: {
                        authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token,
                        "Content-Type": "multipart/form-data"
                    }
                }).then((Response) => {
                    console.log(Response.data)
                    // window.location.reload();
                    setAddNewData(true)
                    setInputValues([])
                    setInputValuesExtra({ name: "", imageUrl: "" })
                    setImage(null)
                }).catch(err => {
                    console.log(err)
                })
                setAdddata(false);
            }).catch(err => {
                toast.error(err.response.data);
            })
        }

        if (!image) {
            const Data = {
                "default": {
                    name: inputValuesExtra.name,
                    email: inputValues.email,
                    phone: inputValues.phone,
                    profession: inputValues.profession,
                },
                "extraData": remainingData,
                dataEntryOpt: JSON.parse(localStorage.getItem('adminInfo')).adminName,
                date: time
            }
            axios.post(`${URL}/admin/dataentryopt/dataentry`, Data, {
                headers: {
                    authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
                }
            }).then((response) => {
                toast.success(response.data);
                setAdddata(false);
                // window.location.reload();
                setAddNewData(true)
                setInputValues([])
                setInputValuesExtra({ name: "", imageUrl: "" })
            }).catch(err => {
                toast.error(err.response.data);
            })
        }
    }


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            //compressing the image 
            if (event.target.files[0].size / (1024 * 1024) < 6) {
                new Compressor(img, { quality: 0.6, success(result) { setImage(result) }, error(err) { console.log(err) } })
            }
            else {
                new Compressor(img, { quality: 0.09, success(result) { setImage(result) }, error(err) { console.log(err) } })
            }
        }
    }

    return (
        <div className='dataManagement'>
            <DashBord />
            <ToastContainer />
            <div className="dataManagementPanel">
                <div className="header">
                    <p>Data Management </p>
                </div>
                <div className="body">
                    <div className="statusCont">
                        <div className="activeAdmin" >
                            <p>Total Data</p>
                            <p>{profileData && profileData.length}</p>
                            <p>Total number of approved users</p>
                        </div>
                        <div className="inputCont">
                            <div className='searchCont'>
                                <img src={search} alt="search" />
                                <input type="text" placeholder='Search' />
                            </div>
                            <div className="exportCont">
                                <button className='exportBtn'>Export</button>
                                <img src={Export} alt="export" />
                            </div>
                            <div className="addEntryCont" onClick={() => { setAdddata(true) }}>
                                <button className='addBtn'>Add Entry</button>
                                <img src={Add} alt="Add" />
                            </div>
                        </div>
                    </div>
                    <div className='hrlineDiv'>
                        <div className='hrLine'></div>
                    </div>
                    <div className="tableCont">
                        <DataEdit openModel={openModel} setOpenModel={setOpenModel} dataInfo={dataInfo} columnData={columnData} setEditData={setEditData} />
                        <table border={0}>
                            <tbody>
                                <tr>
                                    <th> <p> Photo</p></th>
                                    {columnData &&
                                        columnData.defaultData.map((data) => {
                                            return (
                                                <th key={data}><p>{data}*</p></th>
                                            )
                                        })
                                    }
                                    {columnData &&
                                        columnData.addColumn.map((data) => {
                                            return (
                                                <th key={data}><p>{data} </p></th>
                                            )
                                        })
                                    }
                                    <th> <p> Admin Name</p></th>
                                    <th> <p>Actions</p></th>
                                </tr>
                                {addData &&
                                    <tr className='dataEntryCont'>
                                        <th>
                                            {image ? (
                                                <img src={window.URL.createObjectURL(image)} alt="profileImg" className='uploadImg UploadedImg' onClick={() => imageRef.current.click()} />
                                            ) : (
                                                <img src={uploadImg} alt="profileImg" className='uploadImg' onClick={() => imageRef.current.click()} />
                                            )}
                                        </th>
                                        <th><input type="text" value={inputValuesExtra.name} onChange={handleChange} name='name' ref={inputFileRef} /></th>
                                        {columnData &&
                                            columnData.defaultData.filter((data) => data !== 'name').map((data, index) => {
                                                return (
                                                    <th key={data}>
                                                        <input type="text"
                                                            value={inputValues[data] || ''}
                                                            onChange={(e) => handleInputChange(data, e.target.value)}
                                                        />
                                                    </th>
                                                )
                                            })
                                        }
                                        {columnData &&
                                            columnData.addColumn.map((data, index) => {
                                                return (
                                                    <th key={data}>
                                                        <input type="text"
                                                            value={inputValues[data] || ''}
                                                            onChange={(e) => handleInputChange(data, e.target.value)}
                                                        />
                                                    </th>
                                                )
                                            })
                                        }
                                        <th></th>
                                        <th><button onClick={() => { funcSendData() }}>Add</button></th>
                                    </tr>
                                }
                                {profileData &&
                                    profileData.map((data) => {
                                        return (
                                            <tr key={data._id}>
                                                <td>
                                                    <img src={data.imageurl === undefined ? defaultUser : process.env.REACT_APP_PUBLIC_IMG_FOLDER + data.imageurl} alt="profileImg" />
                                                </td>
                                                <td>{data.name}</td>
                                                <td>{data.email}</td>
                                                <td>{data.phone}</td>
                                                <td>{data.profession}</td>
                                                {columnData &&
                                                    columnData.addColumn.map((key) => (
                                                        <td key={key}>{data.extraData[0][key] !== undefined ? data.extraData[0][key] : "N/A"}</td>
                                                    ))
                                                }
                                                <td>{data.dataEntryOpt.name}</td>
                                                <td>
                                                    <div></div>
                                                    <img src={edit} alt="edit" onClick={() => { setOpenModel(true); setDataInfo(data) }} />
                                                    <img src={gEye} alt="eye" />
                                                    <div></div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div style={{ display: "none" }}>
                            <input type="file" name='Photo' ref={imageRef} onChange={onImageChange} accept="image/*" />
                        </div>
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

export default DataManagement

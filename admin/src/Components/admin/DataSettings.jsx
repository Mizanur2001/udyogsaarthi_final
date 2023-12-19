import React, { useEffect, useState } from 'react'
import DashBord from './DashBord'
import '../CSS/admin/DataSettings.css'
import remove from '../../img/Icons/remove.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Loder from '../../img/Icons/loder.svg'

const DataSettings = () => {

    const URL = process.env.REACT_APP_BACKEND_URL
    const [columnData, setColumndata] = useState('')
    const [openInput, srtOpenInpurt] = useState(false)
    const [inputVal, setInputVal] = useState({ data: "" })
    const [getNewColumn, setGetNewColumn] = useState(false)
    const [loder, setLoder] = useState(false)

    useEffect(() => {
        setLoder(true)
        axios.get(`${URL}/admin/data/column/get`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setColumndata(response.data[0])
            setLoder(false)
        }).catch(err => console.log(err.response.data))

        // eslint-disable-next-line
    }, [])

    if (getNewColumn) {
        axios.get(`${URL}/admin/data/column/get`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            setColumndata(response.data[0])
        }).catch(err => console.log(err.response.data))
        setGetNewColumn(false)
    }

    const funcDeleteColumn = (data) => {

        console.log(data)

        axios.delete(`${URL}/admin/data/column/delete`, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            },
            data: {
                data: data
            }
        }).then((response) => {
            toast.success(response.data);
            // window.location.reload();
            setGetNewColumn(true)
            setInputVal({ data: "" })
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    const handleChange = (e) => {
        setInputVal({ ...inputVal, [e.target.name]: e.target.value })
    }

    const funcAddColumn = () => {
        srtOpenInpurt(true)
    }

    const funcAddDataColumn = () => {

        axios.post(`${URL}/admin/data/column/entry`, { data: inputVal.data }, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data);
            srtOpenInpurt(false)
            // window.location.reload();
            setGetNewColumn(true)
            setInputVal({ data: "" })
        }).catch(err => {
            toast.error(err.response.data)
        })
    }

    return (
        <div className='dataSettings'>
            <ToastContainer />
            <DashBord />
            <div className="dataSettingspanel">
                <div className="header">
                    <p>Data Format Settings</p>
                </div>
                <div className="body">
                    <div className="title">
                        <h3>Data Column Management </h3>
                    </div>
                    <div className="columnCont">
                        {columnData &&
                            columnData.defaultData.map((data) => {
                                return (
                                    <div className="column" key={data}>
                                        <p>{data}</p>
                                    </div>
                                )
                            })
                        }
                        {columnData &&
                            columnData.addColumn.map((data) => {
                                return (
                                    <div className="column" key={data}>
                                        <p>{data}</p>
                                        <img src={remove} alt="remove" onClick={() => funcDeleteColumn(data)} />
                                    </div>
                                )
                            })
                        }
                        {openInput &&
                            <div className="column">
                                <input type="text" name='data' value={inputVal.data} onChange={handleChange} />
                                <button onClick={funcAddDataColumn}>Add</button>
                            </div>
                        }
                    </div>
                    {loder &&
                        <div id="loder">
                            <img src={Loder} alt="loder" />
                        </div>
                    }
                    <div className="addColumnCont">
                        <button onClick={funcAddColumn}>Add New Column</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataSettings

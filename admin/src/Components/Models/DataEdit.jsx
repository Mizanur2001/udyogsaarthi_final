import React, { useState, useEffect } from 'react';
import { Modal, useMantineTheme } from "@mantine/core";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataEdit = ({ openModel, setOpenModel, dataInfo, columnData, setEditData }) => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const theme = useMantineTheme();
    const [inputValues, setInputValues] = useState({ ...dataInfo, extraData: dataInfo.extraData || [{}] });

    useEffect(() => {
        // Update inputValues whenever dataInfo changes (e.g., when prop dataInfo changes)
        setInputValues({ ...dataInfo, extraData: dataInfo.extraData || [{}] });
    }, [dataInfo]);

    const handleInputChange = (name, value) => {
        setInputValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExtraDataChange = (data, value) => {
        setInputValues((prev) => ({
            ...prev,
            extraData: prev.extraData.map((item, index) => {
                if (index === 0) {
                    return {
                        ...item,
                        [data]: value,
                    };
                }
                return item;
            }),
        }));
    };

    const handleSaveDetails = (e) => {
        e.preventDefault()
        const adminName = JSON.parse(localStorage.getItem('adminInfo')).adminName === undefined ? "Super Admin" : JSON.parse(localStorage.getItem('adminInfo')).adminName;
        console.log(adminName)
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;

        const updatedInputValues = {
            ...inputValues,
            dataEntryOpt: {
                name: adminName,
                date: formattedDate,
            },
        };

        // Transform extraData to an array with a single object inside
        updatedInputValues.extraData = updatedInputValues.extraData[0];


        axios.post(`${URL}/admin/dataentryopt/dataedit`, updatedInputValues, {
            headers: {
                authToken: localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
            }
        }).then((response) => {
            toast.success(response.data);
            // window.location.reload();
            setEditData(true)
            setOpenModel(false)
        }).catch(err => {
            toast.error(err.response.data);
        })
    };

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
                    <h3>Data details</h3>
                    <div className="inputCont">
                        <input type="text" name="name" value={inputValues.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder='Name' />
                        <input type="email" name="email" value={inputValues.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder='Email' />
                        <input type="text" name="profession" value={inputValues.profession} onChange={(e) => handleInputChange('profession', e.target.value)} placeholder='Profession' />
                        <input type="number" name="phone" value={inputValues.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder='Phone Number' />
                        {columnData && dataInfo &&
                            columnData.addColumn.map((data) => {
                                const value = inputValues.extraData[0][data] || "";
                                return (
                                    <input
                                        type="text"
                                        name={data}
                                        placeholder={data}
                                        value={value}
                                        onChange={(e) => {
                                            handleExtraDataChange(data, e.target.value);
                                        }}
                                        key={data}
                                    />
                                )
                            })}
                    </div>
                    <div className="btnCont">
                        <button className="saveBtn" onClick={handleSaveDetails}>Save Details</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DataEdit;

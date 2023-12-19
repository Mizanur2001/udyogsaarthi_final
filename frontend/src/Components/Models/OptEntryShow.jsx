import React, { useEffect, useState } from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import '../CSS/Models/UserEdit.css'
import axios from 'axios';
import defaultUser from '../../img/DefaultUser.png'
import '../CSS/Models/OptEntryShow.css'

const ShareModel = ({ openModel, setOpenModel, dataOpt }) => {
    const URL = process.env.REACT_APP_BACKEND_URL
    const [Datas, setDatas] = useState("")
    const theme = useMantineTheme();
    const currentDate = new Date();
    const [todayCount, setTodayCount] = useState(0)
    const time = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;

    useEffect(() => {
        axios.post(`${URL}/admin/dataentryopt/getdata/opt/id`, { id: dataOpt._id }, {
            headers: {
                authToken: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : ""
            }
        }).then((response) => {
            setDatas(response.data)
        }).catch(err => {
            console.log(err)
        })

        // eslint-disable-next-line
    }, [openModel])

    useEffect(() => {
        if (Datas) {
            let count = 0
            setTodayCount(0)
            for (const data of Datas) {
                if (data.dataEntryOpt.date === time) {
                    setTodayCount(++count)
                }
            }
        }
    }, [Datas, time])


    return (
        <div>
            <Modal
                overlayProps={{
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                    opacity: 0.55,
                    blur: 4,
                }}
                size="55%"
                opened={openModel}
                onClose={() => setOpenModel(false)}
            >
                <form className='optEntryShowCont'>
                    <h3>Data Entry by {dataOpt.name}</h3>
                    <div className="countDataEntry">
                        <div className='totalDataEntryCount'>
                            <p>Total Data Entry</p>
                            <p>{Datas && Datas.length}</p>
                        </div>
                        <div className='todayDataEntryCount'>
                            <p>Today Data Entry</p>
                            <p>{todayCount}</p>
                        </div>
                    </div>
                    <div className="inputCont">
                        <table border={0}>
                            <tbody>
                                {Datas.length !== 0 &&
                                    <tr>
                                        <th>Photo</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Date</th>
                                    </tr>}

                                {Datas &&
                                    Datas.map((data) => {
                                        return (
                                            <tr key={data._id}>
                                                <td>
                                                    <img src={data.imageurl === undefined ? defaultUser : process.env.REACT_APP_PUBLIC_IMG_FOLDER + data.imageurl} alt="profileImg" />
                                                </td>
                                                <td>{data.name}</td>
                                                <td>{data.email}</td>
                                                <td>{data.phone}</td>
                                                <td>{data.dataEntryOpt.date}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ShareModel

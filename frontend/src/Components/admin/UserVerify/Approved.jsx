import React, { useState, useEffect } from 'react'
import '../../CSS/admin/UserVerify/Approved.css'
import Delete from '../../../img/Icons/delete.svg'
import Edit from '../../../img/Icons/edit.svg'
import UserEdit from '../../Models/UserEdit'
import axios from 'axios'
import Loder from '../../../img/Icons/loder.svg'

const Approved = ({ allUsers, setCountSeter }) => {
  const URL = process.env.REACT_APP_BACKEND_URL
  const [openModel, setOpenModel] = useState(false)
  const [userInfo, setUserInfo] = useState(allUsers)
  const [allUsersData, setAllUsersData] = useState(allUsers)
  const [functionsCalled, setFunctionsCalled] = useState(false);
  const [loder, setLoder] = useState(false)

  if (functionsCalled) {
    axios.get(`${URL}/admin/useradmin/getallusers`, {
      headers: {
        'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
      }
    }).then((Responce) => {
      setAllUsersData(Responce.data)
      setCountSeter(true)
    }).catch(err => console.log(err))
    setFunctionsCalled(false)
  }

  useEffect(() => {
    setLoder(true)
    axios.get(`${URL}/admin/useradmin/getallusers`, {
      headers: {
        'authToken': localStorage.getItem('adminType') === 'superAdmin' ? JSON.parse(localStorage.getItem('adminInfo')) : JSON.parse(localStorage.getItem('adminInfo')).token
      }
    }).then((Responce) => {
      setAllUsersData(Responce.data)
      setCountSeter(true)
      setLoder(false)
    }).catch(err => console.log(err))
    // eslint-disable-next-line
  }, [])

  return (
    <div className='approvedCont'>
      <div className='hrLine'></div>
      <UserEdit openModel={openModel} setOpenModel={setOpenModel} userInfo={userInfo} setFunctionsCalled={setFunctionsCalled} />
      <table border={0}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Accout Status</th>
            <th>Approved By(Admin)</th>
            <th>Action</th>
          </tr>
          {allUsersData &&
            allUsersData.map((users) => {
              if (users.status === 'active') {
                return (
                  <tr key={users._id}>
                    <td>{users.name}</td>
                    <td>{users.email}</td>
                    <td>{users.age}</td>
                    <td>{users.phone}</td>
                    <td>{users.status}</td>
                    <td>{users.adminChangeStatus.adminName}</td>
                    <td>
                      <img src={Delete} alt="Delete" onClick={() => { setOpenModel(true); setUserInfo(users); }} />
                      <img src={Edit} alt="Edit" onClick={() => { setOpenModel(true); setUserInfo(users); }} />
                    </td>
                  </tr>
                )
              } else {
                return (
                  <tr key={users._id}></tr>
                )
              }
            })}
        </tbody>
      </table>
      {loder &&
        <div id="loder">
          <img src={Loder} alt="loder" />
        </div>
      }
    </div>
  )
}

export default Approved

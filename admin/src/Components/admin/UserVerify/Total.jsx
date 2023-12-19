import React, { useState, useEffect } from 'react'
import '../../CSS/admin/UserVerify/Total.css'
import axios from 'axios'
import Loder from '../../../img/Icons/loder.svg'

const Total = ({ allUsers, setCountSeter }) => {
  const URL = process.env.REACT_APP_BACKEND_URL
  const [allUsersData, setAllUsersData] = useState('')
  const [loder, setLoder] = useState(false)


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
    <div className='totalUserCont'>
      <div className='hrLine'></div>
      <table border={0}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Accout Status</th>
            <th>Approved By(Admin)</th>
          </tr>
          {allUsersData &&
            allUsersData.map((users) => {
              return (
                <tr key={users._id}>
                  <td>{users.name}</td>
                  <td>{users.email}</td>
                  <td>{users.age}</td>
                  <td>{users.phone}</td>
                  <td className={users.status}>{users.status}</td>
                  <td>{users.adminChangeStatus.adminName == null ? 'N/A' : users.adminChangeStatus.adminName}</td>
                </tr>
              )
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

export default Total

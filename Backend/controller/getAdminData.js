import jwt from 'jsonwebtoken'
import userAdminModel from '../models/userAdmin.js'
import dataEntryOperatorModel from '../models/dataEntryOperator.js'
import superAdminModels from '../models/superAdmin.js'

const authTokenData = () => {
  return {
    async getData(req, res) {
      try {
        const authToken = req.headers.authtoken
        const { adminType } = req.body
        const decode = jwt.verify(authToken, process.env.SECTRE_KEY)

        if (adminType == 'superAdmin') {
          const findAdmin = await superAdminModels.findOne({ _id: decode.admin.id })
          if (findAdmin == null) {
            return res.status(400).send("Invalid Signature")
          }
          res.send(true)
        }
        else if (adminType == 'dataEntryOpt') {
          const findAdmin = await dataEntryOperatorModel.findOne({ _id: decode.admin.id })
          if (findAdmin == null) {
            return res.status(400).send("Invalid Signature")
          }
          res.send(true)
        }
        else if (adminType == 'userAdmin') {
          const findAdmin = await userAdminModel.findOne({ _id: decode.admin.id })
          if (findAdmin == null) {
            return res.status(400).send("Invalid Signature")
          }
          res.send(true)
        }
        else {
          res.status(400).send("Invalid Signature")
        }
      } catch (error) {
        res.status(500).send("Some error accours " + error)
      }
    }
  }
}

export default authTokenData

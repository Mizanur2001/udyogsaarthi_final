import userModel from '../models/signup.js'
import dataModel from '../models/data.js'
import userAdminModel from '../models/userAdmin.js'
import dataEntryOptModel from '../models/dataEntryOperator.js'

const countDashBord = () => {
    return {
        async count(req, res) {
            try {
                const users = await userModel.find()
                const datas = await dataModel.find()
                const userAdmin = await userAdminModel.find()
                const DataEntryOpt = await dataEntryOptModel.find()

                const Data = {
                    users: users.length,
                    datas: datas.length,
                    userAdmin: userAdmin.length,
                    dataEntryOptModel: DataEntryOpt.length
                }

                res.send(Data)
            } catch (error) {
                res.status(500).send("Internal server Error" + error)
            }
        }
    }
}

export default countDashBord

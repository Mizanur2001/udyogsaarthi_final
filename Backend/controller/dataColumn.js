import columnDataModel from "../models/columnData.js"
import dataEntryOptModel from '../models/dataEntryOperator.js'
import jwt from 'jsonwebtoken'
const dataColumn = () => {
    return {
        async addColumn(req, res) {
            try {
                const { data } = req.body;
                const headers = req.headers

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                if (data == '') {
                    return res.status(400).send("Data Required")
                }

                const findColumn = await columnDataModel.findOne({ defaultData: 'name' })

                if (findColumn == null) {
                    // const dataArray = JSON.parse(data.replace(/'/g, '"'));

                    const addColumnData = new columnDataModel()
                    addColumnData.addColumn = dataArray;
                    await addColumnData.save()
                    res.send("column Added Successfully");
                }
                else {
                    const columnData = await columnDataModel.findOne({ defaultData: 'name' });
                    // const dataArray = JSON.parse(data.replace(/'/g, '"'));
                    // columnData.addColumn.push(...dataArray);
                    columnData.addColumn.push(data);
                    await columnData.save();
                    res.send("column Updated Successfully");
                }
            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }
        },
        async deleteColumn(req, res) {
            try {
                const { data } = req.body

                const headers = req.headers

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                const findColumn = await columnDataModel.findOne({ defaultData: 'name' })
                if (findColumn == null) {
                    return res.status(400).send("Invalid Operation")
                }

                if (!findColumn.addColumn.includes(data)) {
                    return res.status(400).send("Column Does not exist")
                }

                const dataIndex = findColumn.addColumn.indexOf(data);
                findColumn.addColumn.splice(dataIndex, 1);
                await findColumn.save();
                res.send("column Deleted Successfully");

            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }

        },
        async getColumn(req, res) {
            try {
                const Headers = req.headers
                const decode = jwt.verify(Headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    const adminId = decode.admin.id
                    const findAdmin = await dataEntryOptModel.findOne({ _id: adminId })
                    if (findAdmin == null) {
                        return res.status(403).send("Unauthorised Access")
                    }
                }
                const getColumn = await columnDataModel.find()
                res.send(getColumn)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        }
    }
}

export default dataColumn
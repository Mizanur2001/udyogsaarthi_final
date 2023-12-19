import dataEntryOptModel from '../models/dataEntryOperator.js'
import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import nodeMailer from 'nodemailer'
import otpModel from '../models/otp.js'
import columnDataModel from '../models/columnData.js'
import dataModel from '../models/data.js'
import jwt from 'jsonwebtoken'


const dataEntryOpt = () => {

    const requestOtp = async (email) => {
        let OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })

        const findOtp = await otpModel.findOne({ email: email })

        if (findOtp === null) {
            const newOtp = new otpModel({
                email: email,
                otp: OTP,
                status: 'Data Entry Operator',
            })

            const response = await newOtp.save()
            if (response.otp == OTP) {
                return OTP
            }

        } else {
            return findOtp.otp
        }

    }

    const sendMail = async (email, otp) => {
        const transpoter = nodeMailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: process.env.GMAIL_PORT,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
            }
        })

        const mailOption = ({
            from: process.env.GMAIL,
            to: email,
            subject: "Admin Login OTP",
            html: `
                <p>Your OTP is <strong>${otp}</strong></p>
            `
        })

        transpoter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }

    return {
        async signup(req, res) {
            try {

                const { name, email, phone, password } = req.body
                const headers = req.headers

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)

                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                if (name == '' || email == '' || phone == '' || password == '') {
                    return res.status(400).send('All field required')
                }

                if (phone.length != 10) {
                    return res.status(400).send('Invalid Phone')
                }

                if (name.length <= 3) {
                    return res.status(400).send("Name should be Grater Than three char")
                }

                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue === -1) {
                    return res.status(400).send("Chose a strong Password")
                }

                const findEmail = await dataEntryOptModel.findOne({ email: email })
                const findPhone = await dataEntryOptModel.findOne({ phone: phone })

                if (findEmail != null || findPhone != null) {
                    return res.status(400).send("Admin Already Exist")
                }

                //hashing password
                const salt = await bcrypt.genSalt(10)
                const hsahPass = await bcrypt.hash(password, salt)

                const dataEntryOptInfo = new dataEntryOptModel({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hsahPass
                })

                dataEntryOptInfo.save().then(() => {
                    res.status(200).send("Admin Created successfully")

                    /*===================================================
                        to do --> send  email to Super admin & User admin mail 
                        ================================================
                    */

                }).catch((err) => {
                    res.send(500).send("Something Went Wrong" + err);
                })

            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async permissions(req, res) {
            try {
                const { edit, entry, email } = req.body
                const headers = req.headers
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }
                const findEmail = dataEntryOptModel.findOne({ email: email })

                if (findEmail == '' || entry === '' || edit === '' || !findEmail) {
                    return res.status(403).send("Access Denied")
                }

                if (findEmail == null) {
                    return res.status(403).send("Access Denied")
                }

                dataEntryOptModel.updateOne({ email: email }, {
                    $set: {
                        'permissions.edit': edit,
                        'permissions.entry': entry
                    }
                }).then(() => {
                    res.status(200).send("Permission Updated")
                }).catch(err => res.status(500).send("internal server Error " + err))


            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }
        },
        async login(req, res) {
            try {

                const { email, password } = req.body
                const findOpt = await dataEntryOptModel.findOne({ email: email })

                if (findOpt == null) {
                    return res.status(403).send("Invalid Password Or email")
                }

                const passMatch = await bcrypt.compare(password, findOpt.password)

                if (!passMatch) {
                    return res.status(403).send("Invalid Password Or email")
                }

                const OTP = await requestOtp(email)
                await sendMail(email, OTP)

                res.status(200).send("OTP Sent successfully")
            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }
        },
        async verify(req, res) {
            try {
                const { email, otp } = req.body
                const findOtp = await otpModel.findOne({ email: email })
                if (findOtp == null) {
                    return res.status(403).send('Access Denied')
                }

                if (findOtp.otp != otp) {
                    return res.status(400).send('Invalid OTP')
                }

                await otpModel.deleteOne({ email: email })
                const findOpt = await dataEntryOptModel.findOne({ email: email })

                const jwtData = {
                    admin: {
                        id: findOpt._id
                    }
                }

                const jwt_Token = jwt.sign(jwtData, process.env.SECTRE_KEY)

                const adminInfo = {
                    token: jwt_Token,
                    adminName: findOpt.name,
                    admin_id: findOpt._id,
                    adminType: findOpt.adminType
                }

                res.send(adminInfo)
            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }
        },
        async dataEntry(req, res) {

            try {
                const data = req.body
                const authToken = req.headers
                const decoded = jwt.verify(authToken.authtoken, process.env.SECTRE_KEY);
                if (decoded.admin.type != 'superAdmin') {

                    const findOptPermission = await dataEntryOptModel.findOne({ _id: decoded.admin.id })
                    if (!findOptPermission.permissions.entry) {
                        return res.status(403).send("Access Denied")
                    }

                }
                else {
                    data.dataEntryOpt = decoded.admin.name
                }
                const defaultData = data.default
                if (!defaultData.name || defaultData.name == '' || !defaultData.email || defaultData.email == '' || !defaultData.phone || defaultData.phone == '' || !defaultData.profession || defaultData.profession == '') {
                    return res.status(400).send("Required Field missing")
                }

                const findEmail = await dataModel.findOne({ email: data.default.email })
                const findPhone = await dataModel.findOne({ phone: data.default.phone })
                if (findPhone != null) {
                    return res.status(400).send("Phone Number is Already register")
                }

                if (findEmail != null) {
                    return res.status(400).send("Email is Already register")
                }

                const entryData = new dataModel({
                    name: data.default.name,
                    email: data.default.email,
                    phone: data.default.phone,
                    profession: data.default.profession,
                    imageurl: data.default.imageurl,
                    extraData: [data.extraData],
                    'dataEntryOpt.name': data.dataEntryOpt,
                    'dataEntryOpt.date': data.date
                })

                //checking the entering clumn is vaid or not
                const columnData = await columnDataModel.findOne({ defaultData: 'name' })
                for (const e in entryData.extraData[0]) {
                    const hasInclude = columnData.addColumn.includes(e);
                    if (!hasInclude) {
                        return res.status(400).send("Invalid Column Sent")
                    }
                }

                entryData.save().then(() => {
                    res.send("Data Added Successfully")
                }).catch(err => {
                    res.send(err)
                })

            } catch (error) {
                res.status(500).send("Something Went Wrong" + error);
            }

        },
        async dataEdit(req, res) {
            try {
                const data = req.body
                const authToken = req.headers
                const defaultData = data

                const decoded = jwt.verify(authToken.authtoken, process.env.SECTRE_KEY);

                if (decoded.admin.type != 'superAdmin') {
                    const findOptPermission = await dataEntryOptModel.findOne({ _id: decoded.admin.id })
                    if (!findOptPermission.permissions.edit) {
                        return res.status(403).send("Access Denied")
                    }
                }
                else {
                    data.dataEntryOpt.name = decoded.admin.name
                }

                if (!defaultData.name || defaultData.name == '' || !defaultData.email || defaultData.email == '' || !defaultData.phone || defaultData.phone == '' || !defaultData.profession || defaultData.profession == '') {
                    return res.status(400).send("Required Field missing")
                }

                const findUsers = await dataModel.findOne({ _id: data._id })

                if (findUsers.email != data.email) {

                    const findEmail = await dataModel.findOne({ email: data.email })

                    if (findEmail != null) {
                        return res.status(400).send("Email Alrady Register")
                    }
                }

                if (findUsers.phone != data.phone) {

                    const findPhone = await dataModel.findOne({ phone: data.phone })

                    if (findPhone != null) {
                        return res.status(400).send("Phone Alrady Register")
                    }
                }

                if (findUsers == null) {
                    return res.status(400).send("Invalid user")
                }


                findUsers.name = data.name;
                findUsers.email = data.email;
                findUsers.phone = data.phone;
                findUsers.profession = data.profession;
                findUsers.extraData = [data.extraData];
                findUsers.dataEntryOpt = {
                    name: data.dataEntryOpt.name,
                    date: data.dataEntryOpt.date
                };

                findUsers.save().then(() => {
                    res.send("Data Updated Successfully")
                }).catch(err => {
                    res.status(500).send('Internal Server Error ' + err)
                });


            } catch (error) {
                res.send(500).send("Something Went Wrong" + error);
            }
        },
        async getAllData(req, res) {
            try {
                const Headers = req.headers
                const decode = jwt.verify(Headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    // const adminId = decode.admin.id
                    // const findAdmin = await dataEntryOptModel.findOne({ _id: adminId })
                    // if (findAdmin == null) {
                    return res.status(403).send("Unauthorised Access")
                    // }
                }
                const allData = await dataModel.find().sort({ createdAt: -1 })
                res.send(allData)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async getOptDataEntry(req, res) {
            try {
                const Headers = req.headers
                const decode = jwt.verify(Headers.authtoken, process.env.SECTRE_KEY)
                const findOpt = await dataEntryOptModel.findOne({ _id: decode.admin.id })
                if (findOpt == null) {
                    return res.status(403).send("Unauthorised Access")
                }

                const DataEnryByOpt = await dataModel.find({ "dataEntryOpt.name": findOpt.name }).sort({ createdAt: -1 })
                res.send(DataEnryByOpt)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async getOptDataEntryById(req, res) {
            try {
                const { id } = req.body
                const Headers = req.headers
                const decode = jwt.verify(Headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    return res.status(403).send("Unauthorised Access")
                }
                const findOpt = await dataEntryOptModel.findOne({ _id: id })
                if (findOpt == null) {
                    return res.status(403).send("Unauthorised Access")
                }

                const DataEnryByOpt = await dataModel.find({ "dataEntryOpt.name": findOpt.name }).sort({ createdAt: -1 })
                res.send(DataEnryByOpt)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async getAllOpt(req, res) {
            const headers = req.headers

            try {
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)

                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                const allOpt = await dataEntryOptModel.find().sort({ createdAt: -1 })

                res.send(allOpt)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async updateOpt(req, res) {
            const headers = req.headers
            const { id, name, email, phone, password } = req.body
            try {
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)

                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                if (!name || !email || !phone || !id || name == '' || email == '' || phone == '' || id == '') {
                    return res.status(400).send("All field required")
                }

                const findOpt = await dataEntryOptModel.findOne({ _id: id })

                if (findOpt == null) {
                    return res.status(403).send("Unauthorised Access")
                }

                if (findOpt.email !== email) {

                    const findEmail = await dataEntryOptModel.findOne({ email: email })

                    if (findEmail != null) {
                        return res.status(400).send("Email is Using another Admin")
                    }

                }

                if (findOpt.phone != phone) {

                    const findPhone = await dataEntryOptModel.findOne({ phone: phone })

                    if (findPhone != null) {
                        return res.status(400).send("Phone Number is Using another Admin")
                    }
                }

                if (phone.toString().length != 10) {
                    return res.status(400).send("Invalid Phone")
                }


                if (password != undefined) {
                    const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                    if (strongPassTrue === -1) {
                        return res.status(400).send("Chose a strong Password")
                    }

                    const salt = await bcrypt.genSalt(10)
                    const hsahPass = await bcrypt.hash(password, salt)


                    dataEntryOptModel.updateOne({ _id: id }, {
                        $set: {
                            password: hsahPass
                        }
                    }).then(() => {
                    }).catch(err => res.send(err))
                }


                dataEntryOptModel.updateOne({ _id: id }, {
                    $set: {
                        name: name,
                        email: email,
                        phone: phone
                    }
                }).then(() => {
                    res.send("Admin Updated Successfully")
                }).catch(err => res.send(err))


            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async deleteOpt(req, res) {
            const { id } = req.body
            const headers = req.headers
            try {
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type !== 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                const findOpt = await dataEntryOptModel.findOne({ _id: id })
                if (findOpt == null) {
                    return res.status(403).send("Unauthorised Access")
                }

                await dataEntryOptModel.deleteOne({ _id: id }).then(() => {
                    res.send("Admin Deleted Successfully")
                }).catch(err => {
                    res.send(err)
                })

            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        }
    }
}

export default dataEntryOpt
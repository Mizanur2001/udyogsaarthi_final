import userAdminModel from '../models/userAdmin.js'
import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import otpModel from '../models/otp.js'
import nodeMailer from 'nodemailer'
import usersModel from '../models/signup.js'
import jwt from 'jsonwebtoken'

const userAdmin = () => {
    const requestOtp = async (email) => {
        let OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })

        const findOtp = await otpModel.findOne({ email: email })

        if (findOtp === null) {
            const newOtp = new otpModel({
                email: email,
                otp: OTP,
                status: 'User Admin',
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
                const { name, email, password, phone } = req.body
                const headers = req.headers

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type !== 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                if (email == '' || name == '' || phone == '' || password == '') {
                    return res.status(400).send("All Field Required")
                }

                if (name.length <= 3) {
                    return res.status(400).send("Name should be Grater Than three char")
                }

                if (phone.length !== 10) {
                    return res.status(400).send("Invalid Phone Number")
                }

                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue === -1) {
                    return res.status(400).send("Chose a strong Password")
                }

                const findEmail = await userAdminModel.findOne({ email: email })
                const findPhone = await userAdminModel.findOne({ phone: phone })

                if (findEmail != null || findPhone != null) {
                    return res.status(400).send("Admin Already Exist")
                }

                //hashing password
                const salt = await bcrypt.genSalt(10)
                const hsahPass = await bcrypt.hash(password, salt)

                const userAdminData = new userAdminModel({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hsahPass
                })

                userAdminData.save().then(() => {
                    res.status(200).send("Admin Created successfully")

                    /*===================================================
                        to do --> send  email to Super admin & User admin mail 
                        ================================================
                    */

                }).catch((err) => {
                    res.send(500).send("Something Went Wrong" + err);
                })
            } catch (error) {
                res.send("Some error occure" + error)
            }
        },
        async login(req, res) {
            try {
                const { email, password } = req.body
                const findAdmin = await userAdminModel.findOne({ email: email })
                if (findAdmin === null) {
                    return res.status(403).send("Invalid Email or Password")
                }

                const matchPass = await bcrypt.compare(password, findAdmin.password)
                if (!matchPass) {
                    return res.status(403).send("Invalid Email or Password")
                }


                const otp = await requestOtp(email)
                sendMail(email, otp)
                res.status(200).send("Otp Send Successfully")

            } catch (error) {
                res.status(500).send("Some error accours " + err)
            }
        },
        async verify(req, res) {
            try {
                const { otp, email } = req.body
                const findOtp = await otpModel.findOne({ email: email })
                if (findOtp === null) {
                    return res.status(403).send("Unauthorize Access denied")
                }
                if (findOtp.otp != otp) {
                    return res.status(400).send("Invalid OTP")
                }

                await otpModel.deleteOne({ email: email })
                const userAdminInfo = await userAdminModel.findOne({ email: email })
                /*===================================================
                        to do --> send  email to Super admin & User admin mail 
                  ================================================
                */

                const jwtData = {
                    admin: {
                        id: userAdminInfo._id
                    }
                }

                const jwt_Token = jwt.sign(jwtData, process.env.SECTRE_KEY)

                const adminInfo = {
                    token: jwt_Token,
                    adminName: userAdminInfo.name,
                    admin_id: userAdminInfo._id
                }

                res.send(adminInfo)

            } catch (error) {
                res.status(500).send("Some error accours " + error)
            }
        },
        async verifyUsers(req, res) {
            try {
                const { userEmail, adminName, time, status } = req.body
                let AdminName = adminName
                const headers = req.headers

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type == 'superAdmin') {
                    AdminName = decode.admin.name
                }
                const findUsers = await usersModel.findOne({ email: userEmail })

                if (findUsers == null) {
                    return res.status(403).send("Unauthorize Access denied")
                }

                if (status == 'pending' || status == 'rejected' || status == 'active') {

                    usersModel.updateOne({ email: userEmail }, {
                        $set: {
                            status: status,
                            "adminChangeStatus.adminName": AdminName,
                            "adminChangeStatus.time": time,
                        }
                    }).then(() => {
                        res.status(200).send("Status updated Successfully")
                    }).catch(err => {
                        res.status(500).send("Some error accure" + err)
                    })
                }
                else {
                    return res.status(403).send("Unauthorize Admin Access denied")
                }
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async updateUser(req, res) {
            try {
                const { userEmail, userName, userPhone, age, userId } = req.body
                const findUsers = await usersModel.findOne({ _id: userId })

                if (findUsers == null) {
                    return res.status(403).send("Unauthorize Access denied")
                }

                if (userName == '' || userPhone == '' || age == '' || userEmail == '') {
                    return res.status(400).send("Bad Request")
                }

                if (userName.length <= 3) {
                    return res.status(400).send("Name should be more Than three char")
                }

                if (userPhone.toString().length != 10) {
                    return res.status(400).send("Invalid Phone Number")
                }

                if (findUsers.email != userEmail) {

                    const findEmail = await usersModel.findOne({ email: userEmail })

                    if (findEmail != null) {
                        return res.status(400).send("Email Adready Register")
                    }

                }

                if (findUsers.phone != userPhone) {

                    const findPhone = await usersModel.findOne({ phone: userPhone })

                    if (findPhone != null) {
                        return res.status(400).send("Phone Adraedy Register")
                    }
                }

                usersModel.updateOne({ _id: userId }, {
                    $set: {
                        name: userName,
                        phone: userPhone,
                        age: age,
                        email: userEmail
                    }
                }).then(() => {
                    res.status(200).send("User data Updated Successfully")
                }).catch(err => res.status(500).send(err))

            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async deleteUser(req, res) {
            try {
                const { userId } = req.body
                const findUsers = await usersModel.findOne({ _id: userId })

                if (findUsers == null) {
                    return res.status(403).send("Unauthorize Access denied")
                }

                usersModel.deleteOne({ _id: userId }).then(() => {
                    res.status(200).send("User deleted Successfully")
                }).catch(err => res.status(500).send("Internal Server Error " + err))
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async getAllUsers(req, res) {
            try {
                const Headers = req.headers
                const decode = jwt.verify(Headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    const adminId = decode.admin.id
                    const findAdmin = await userAdminModel.findOne({ _id: adminId })
                    if (findAdmin == null) {
                        return res.status(403).send("Unauthorised Access")
                    }
                }
                const allUsers = await usersModel.find().sort({ createdAt: -1 })
                res.send(allUsers)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async getAllAdmin(req, res) {
            try {
                const headers = req.headers
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type != 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }
                const allUserAdmin = await userAdminModel.find().sort({ createdAt: -1 })
                res.send(allUserAdmin)
            } catch (error) {
                res.status(500).send("Some error occure" + error)
            }
        },
        async editAdmin(req, res) {
            const { name, email, phone, password, id } = req.body
            const headers = req.headers
            try {

                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type !== 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                if (!name || !email || !phone || !id || name == '' || email == '' || phone == '' || id == '') {
                    return res.status(400).send("All field required")
                }

                const findAdmin = await userAdminModel.findOne({ _id: id })
                if (findAdmin.email !== email) {

                    const findEmail = await userAdminModel.findOne({ email: email })

                    if (findEmail != null) {
                        return res.status(400).send("Email is Using another Admin")
                    }

                }

                if (findAdmin.phone != phone) {

                    const findPhone = await userAdminModel.findOne({ phone: phone })

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


                    userAdminModel.updateOne({ _id: id }, {
                        $set: {
                            password: hsahPass
                        }
                    }).then(() => {
                        //res.send("Admin Password Updated Successfully")
                    }).catch(err => res.send(err))
                }


                userAdminModel.updateOne({ _id: id }, {
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
        async deleteAdmin(req, res) {
            const { id } = req.body
            const headers = req.headers
            try {
                const decode = jwt.verify(headers.authtoken, process.env.SECTRE_KEY)
                if (decode.admin.type !== 'superAdmin') {
                    return res.status(401).send("Unauthorised Access")
                }

                const findAdmin = await userAdminModel.findOne({ _id: id })
                if (findAdmin == null) {
                    return res.status(403).send("Unauthorised Access")
                }

                await userAdminModel.deleteOne({ _id: id }).then(() => {
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
export default userAdmin
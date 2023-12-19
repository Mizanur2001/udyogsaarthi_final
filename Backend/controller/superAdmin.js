import superAdminModels from "../models/superAdmin.js"
import otpModel from '../models/otp.js'
import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const superAdmin = () => {

    const requestOtp = async (email) => {
        let OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })

        const findOtp = await otpModel.findOne({ email: email })

        if (findOtp === null) {
            const newOtp = new otpModel({
                email: email,
                otp: OTP,
                status: 'Super Admin',
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
            subject: "Super Admin Login OTP",
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
        async login(req, res) {
            const { email, password } = req.body

            if (!email || !password || email == '' || password == '') {
                return res.status(400).send('All field Required')
            }

            try {
                const findSuperAdmin = await superAdminModels.findOne({ email: email })
                if (findSuperAdmin == null) {
                    return res.status(401).send('Invalid Credentials')
                }


                const matchPass = await bcrypt.compare(password, findSuperAdmin.password)

                if (!matchPass) {
                    return res.status(401).send('Invalid Credentials')
                }

                const OTP = await requestOtp(email)
                await sendMail(email, OTP)

                res.status(200).send("OTP Sent successfully")


            } catch (error) {
                res.status(500).send("Something Went Wrong " + error)
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
                const superAdminInfo = await superAdminModels.findOne({ email: email })

                const jwtData = {
                    admin: {
                        id: superAdminInfo._id,
                        type: 'superAdmin',
                        name: superAdminInfo.name
                    }
                }

                const jwt_Token = jwt.sign(jwtData, process.env.SECTRE_KEY)
                res.send(jwt_Token)
            } catch (error) {
                res.status(500).send("Some error accours " + error)
            }
        },
        async signup(req, res) {
            try {
                const { email, pass } = req.body
                if (!email || !pass) {
                    return res.status(400).send("All Field Required")
                }

                const strongPassTrue = pass.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                if (strongPassTrue === -1) {
                    return res.status(400).send("Chose a strong Password")
                }

                const findEmail = await superAdminModels.findOne({ email: email })
                if (findEmail != null) {
                    return res.status(400).send("Admin Already Exist")
                }

                //hashing password
                const salt = await bcrypt.genSalt(10)
                const hsahPass = await bcrypt.hash(pass, salt)

                const superAdmin = new superAdminModels({
                    name: 'Super Admin(kalom)',
                    email: email,
                    phone: '9748072771',
                    password: hsahPass
                })

                superAdmin.save().then(() => {
                    res.status(200).send("Admin Created Successfully")
                }).catch(err => {
                    res.status(500).send("Internal Server error " + err)
                })

            } catch (error) {
                res.status(500).send("Something Went Wrong " + error)
            }
        }
    }
}

export default superAdmin

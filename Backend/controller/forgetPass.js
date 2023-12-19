import userModel from '../models/signup.js'
import otpModel from '../models/otp.js'
import otpGenerator from 'otp-generator'
import nodeMailer from 'nodemailer'
import bcrypt from 'bcrypt'

const forgetPass = () => {

    const requestOtp = async (email) => {
        let OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })

        const findOtp = await otpModel.findOne({ email: email })

        if (findOtp === null) {
            const newOtp = new otpModel({
                email: email,
                otp: OTP,
                status: 'Forgot Password(Unverified)',
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
            subject: "Forgot Password OTP",
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
        async checkEmail(req, res) {
            try {
                const { email } = req.body
                const findEmail = await userModel.findOne({ email: email })
                if (findEmail == null) {
                    return res.status(400).send("Invalid Email")
                }
                const otp = await requestOtp(email)
                sendMail(email, otp)
                res.status(200).send("Otp Send Successfully")
            } catch (error) {
                res.status(500).send("Internal Server error")
            }
        },
        async checkOtp(req, res) {
            try {
                const { otp, email } = req.body
                const findOtp = await otpModel.findOne({ email: email })
                if (findOtp === null) {
                    return res.status(403).send("Unauthorized Access")
                }

                if (findOtp.otp != otp) {
                    return res.status(400).send("Invalid OTP")
                }

                otpModel.updateOne({ email: email }, {
                    $set: {
                        'status': "Forgot Password(verified)"
                    }
                }).then(() => {
                    res.send("OTP Verified")
                }).catch((err) => {
                    res.status(500).send(err)
                })

            } catch (error) {
                res.status(500).send("Internal Server error")
            }
        },
        async changePass(req, res) {
            try {
                const { email, password, cpassword } = req.body
                const findOtp = await otpModel.findOne({ email: email })

                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)

                if (findOtp === null) {
                    return res.status(403).send("Unauthorized Access")
                }

                if (findOtp.status != 'Forgot Password(verified)') {
                    return res.status(403).send("Unauthorized Access")
                }

                if (strongPassTrue == -1) {
                    return res.status(400).send("Chose a Strong password")
                }

                if (password != cpassword) {
                    return res.status(400).send("Password not matched")
                }

                const salt = await bcrypt.genSalt(10)
                const hasspass = await bcrypt.hash(password, salt)
                await otpModel.deleteOne({ email: email })
                
                userModel.updateOne({ email: email }, {
                    $set: {
                        password: hasspass
                    }
                }).then(() => {
                    res.send('Password Changed Successfully')
                }).catch((err) => res.status(500).send(err))

            } catch (error) {
                res.status(500).send("Internal Server error")
            }
        }
    }
}

export default forgetPass

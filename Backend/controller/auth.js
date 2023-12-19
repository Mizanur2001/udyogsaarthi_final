import signUpModel from '../models/signup.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import nodeMailer from 'nodemailer'
import otpModel from '../models/otp.js'

const auth = () => {

    const requestOtp = async (email) => {
        let OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        })

        const findOtp = await otpModel.findOne({ email: email })

        if (findOtp === null) {
            const newOtp = new otpModel({
                email: email,
                otp: OTP,
                status: 'User',
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
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        })

        const mailOption = ({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Udyogsaarthi-OTP",
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
            const { email, name, phone, password, cpassword } = req.body;
            try {
                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                const findEmail = await signUpModel.findOne({ email: email })
                const findPhone = await signUpModel.findOne({ phone: phone })

                if (findEmail) {
                    return res.send({
                        status: 403,
                        message: "Email alrady exit"
                    })
                }

                if (findPhone) {
                    return res.send({
                        status: 403,
                        message: "Phone alrady exit"
                    })
                }

                if (email == '' || name == '' || phone == '' || password == '' || cpassword == '') {
                    return res.send({
                        status: 403,
                        message: "All Field Required"
                    })
                }

                if (phone.length != 10) {
                    return res.send({
                        status: 400,
                        message: "Invalid Phone"
                    })
                }

                if (strongPassTrue == -1) {
                    return res.send({
                        status: 400,
                        message: "Chose a Strong password"
                    })
                }

                if (password != cpassword) {
                    return res.send({
                        status: 400,
                        message: "Password not matched"
                    })
                }

                //Caculate Age
                // const date = new Date()
                // const currentYear = date.getFullYear()
                // const age = currentYear - year

                const otp = await requestOtp(email)
                sendMail(email, otp)

                res.status(200).send({
                    status: 200,
                    message: "OTP Sent Successfully"
                });

            } catch (error) {
                res.status(500).send("some error acurd with internal server" + error)
            }
        },
        async verify(req, res) {
            try {
                const { email, name, phone, password, otp } = req.body;

                const ServerOTP = await otpModel.findOne({ email })

                if (ServerOTP == null) {
                    return res.send({
                        status: 403,
                        message: "otp is not exits for this email"
                    })
                }

                if (ServerOTP.otp == otp) {
                    return res.send({
                        status: 403,
                        message: "Invalid OTP"
                    })
                }

                const salt = await bcrypt.genSalt(10)
                const hasspass = await bcrypt.hash(password, salt)

                const userData = new signUpModel({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hasspass,
                })

                userData.save().then(() => {
                    res.status(200).send({
                        status: 200,
                        message: "User Created Sucessfully"
                    });
                }).catch(err => {
                    res.status(500).send("Internal Server Eror..." + err);
                })

            } catch (error) {
                res.status(500).send("some error acurd with internal server" + error)
            }
        },
        async login(req, res) {
            const { email, password } = req.body
            try {
                const userData = await signUpModel.findOne({ email: email })

                if (email == '' || password == '') {
                    return res.send({
                        status: 400,
                        message: "All field require"
                    })
                }

                if (userData == null) {
                    return res.send({
                        status: 403,
                        message: "Invalid Email or Password"

                    })
                }

                const compPass = await bcrypt.compare(password, userData.password)

                if (!compPass) {
                    return res.send({
                        status: 403,
                        message: "Invalid Email or Password"
                    })
                }


                const Data = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                }


                const Jwt_sign = jwt.sign(Data, process.env.SECTRE_KEY)
                res.send({
                    status: 200,
                    data: {
                        userInfo: Data,
                        jwtToken: Jwt_sign
                    },
                    message: "User info"
                })

            } catch (error) {
                res.status(500).send("Server error" + error)
            }
        }
    }
}

export default auth
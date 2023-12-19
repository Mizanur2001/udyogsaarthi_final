import signUpModel from '../models/signup.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const auth = () => {
    return {
        async signup(req, res) {
            const { email, name, year, phone, password, cpassword } = req.body;
            try {
                const strongPassTrue = password.search(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
                const findEmail = await signUpModel.findOne({ email: email })
                const findPhone = await signUpModel.findOne({ phone: phone })

                if (findEmail) {
                    return res.status(403).send("Email alrady exit")
                }

                if (findPhone) {
                    return res.status(403).send("Phone alrady exit")
                }

                if (email == '' || name == '' || year == '' || phone == '' || password == '' || cpassword == '') {
                    return res.status(403).send("All Field Required")
                }

                if (phone.length != 10) {
                    return res.status(400).send("Invalid Phone")
                }

                if (strongPassTrue == -1) {
                    return res.status(400).send("Chose a Strong password")
                }

                if (password != cpassword) {
                    return res.status(400).send("Password not matched")
                }

                const salt = await bcrypt.genSalt(10)
                const hasspass = await bcrypt.hash(password, salt)

                //Caculate Age
                const date = new Date()
                const currentYear = date.getFullYear()
                const age = currentYear - year

                const userData = new signUpModel({
                    name: name,
                    email: email,
                    phone: phone,
                    age: age,
                    password: hasspass,
                })

                userData.save().then(() => {
                    res.status(200).send("Data Saved Sucessfully");
                }).catch(err => {
                    res.status(500).send("Internal Server Eror..." + err);
                })
            } catch (error) {
                res.status(404).send("some error acurd with internal server")
            }
        },

        async login(req, res) {
            const { email, password } = req.body
            try {
                const userData = await signUpModel.findOne({ email: email })

                if (email == '' || password == '') {
                    return res.status(403).send("All field require")
                }

                if (userData == null) {
                    return res.status(403).send("Invalid Email or Password")
                }

                const compPass = await bcrypt.compare(password, userData.password)

                if (!compPass) {
                    return res.status(403).send("Invalid Email or Password")
                }

                if (userData.status === 'pending' || userData.status === 'rejected') {
                    return res.send("not approved")
                }


                const Data = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    age: userData.age
                }


                const Jwt_sign = jwt.sign(Data, process.env.SECTRE_KEY)
                res.send(Jwt_sign)

            } catch (error) {
                res.status(500).send("Server error" + error)
            }
        }
    }
}

export default auth
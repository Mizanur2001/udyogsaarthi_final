import express from 'express';
import mongoose from 'mongoose';
import Web from './routes/web.js'
import env from 'dotenv'
import cors from 'cors'
env.config()


//Calling Functions & use Middlewares
const app = express()
app.use(express.json())
app.use(cors({}))


//serve public file
app.use(express.static('public'));
app.use('/image', express.static('image'));


//Calling .env file value
const PORT = process.env.PORT;
const URL = process.env.MONGODB_URL;


//Connection with MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DataBase Connected...")
}).catch(err => {
    console.log("Unable to Connect..." + err)
})


//routes
Web(app)
app.use((req, res) => {
    res.status(404).send("Page not found")
})


//Server listenig on ports
app.listen(PORT, () => {
    console.log(`Server is Listening on Port ${PORT}`)
})
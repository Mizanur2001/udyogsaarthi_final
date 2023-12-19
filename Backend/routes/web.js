import auth from "../controller/auth.js";
import userAdmin from "../controller/userAdmin.js";
import dataEntryOpt from "../controller/dataEntryOpt.js";
import dataColumn from "../controller/dataColumn.js";
import jwtVerify from "../middleware/jwtFetchusers.js";
import superAdmin from "../controller/superAdmin.js";
import getAdminData from "../controller/getAdminData.js";
import searchEngine from "../controller/searchEngine.js";
import uploadController from '../controller/uploadImg.js';
import multerUpload from '../Files/multer.js'
import countDashBord from "../controller/countDashBord.js";
import forgetPass from "../controller/forgetPass.js";


const Web = (app) => {
    app.post('/signup', auth().signup);
    app.post('/verify', auth().verify);
    app.post('/login', auth().login);
    app.post('/admin/useradmin/signup', jwtVerify, userAdmin().signup) //super Admin (done)
    app.post('/admin/useradmin/login', userAdmin().login)
    app.post('/admin/useradmin/login/verify', userAdmin().verify)
    app.put('/admin/useradmin/verifyuser', jwtVerify, userAdmin().verifyUsers)
    app.put('/admin/useradmin/updateuser', jwtVerify, userAdmin().updateUser)
    app.delete('/admin/useradmin/deleteuser', jwtVerify, userAdmin().deleteUser)
    app.get('/admin/useradmin/getallusers', jwtVerify, userAdmin().getAllUsers)
    app.get('/admin/useradmin/getalladmin', jwtVerify, userAdmin().getAllAdmin) //Super Admin(done)
    app.post('/admin/useradmin/editadmin', jwtVerify, userAdmin().editAdmin) //Super Admin (done)
    app.delete('/admin/useradmin/deleteadmin', jwtVerify, userAdmin().deleteAdmin) //Super Admin (done)
    app.post('/admin/dataentryopt/signup', jwtVerify, dataEntryOpt().signup) //super Admin (done)
    app.post('/admin/dataentryopt/login', dataEntryOpt().login)
    app.post('/admin/dataentryopt/login/verify', dataEntryOpt().verify)
    app.put('/admin/dataentryopt/permissions', jwtVerify, dataEntryOpt().permissions) //super Admin (done)
    app.post('/admin/dataentryopt/dataentry', jwtVerify, dataEntryOpt().dataEntry)
    app.post('/admin/dataentryopt/dataedit', jwtVerify, dataEntryOpt().dataEdit)
    app.get('/admin/dataentryopt/getalldata', jwtVerify, dataEntryOpt().getAllData) //super Admin(done)
    app.get('/admin/dataentryopt/getdata/opt', jwtVerify, dataEntryOpt().getOptDataEntry)
    app.post('/admin/dataentryopt/getdata/opt/id', jwtVerify, dataEntryOpt().getOptDataEntryById) //super Admin(done)
    app.get('/admin/dataentryopt/getallopt', jwtVerify, dataEntryOpt().getAllOpt)//super Admin(done)
    app.put('/admin/dataentryopt/updateopt', jwtVerify, dataEntryOpt().updateOpt)//super Admin(done)
    app.delete('/admin/dataentryopt/deleteopt', jwtVerify, dataEntryOpt().deleteOpt)//super Admin (done)
    app.post('/admin/data/column/entry', jwtVerify, dataColumn().addColumn) //super Admin (done)
    app.delete('/admin/data/column/delete', jwtVerify, dataColumn().deleteColumn) //super Admin (done)
    app.get('/admin/data/column/get', jwtVerify, dataColumn().getColumn)
    app.post('/superadmin/signup/v1/sqfWoSI0Pd3FJuIrHwHFXOTSFcbVM3aybWViOx7wH7hKegmGoyd55rCzvQbZ24Th3q5XUxwzU5hmrVpQjQqIQ8FJ7P9S410vcAsMZoY0seQ0XFcT2Iz5rtD1mLEMMgmoqowpLzaHIu1GVaAhXyWHbi', superAdmin().signup)
    app.post('/superadmin/login', superAdmin().login)
    app.post('/superadmin/login/verify', superAdmin().verify)
    app.post('/admin/authtoken/verify', jwtVerify, getAdminData().getData)
    app.post('/users/search/quary', jwtVerify, searchEngine().searchQuary)
    app.post('/upload/img', jwtVerify, multerUpload.single('Photo'), uploadController().uploadimg)
    app.get('/admin/dashbord/count', jwtVerify, countDashBord().count)
    app.post('/user/forgetpass/email', forgetPass().checkEmail)
    app.post('/user/forgetpass/otp', forgetPass().checkOtp)
    app.post('/user/forgetpass/password', forgetPass().changePass)
}

export default Web